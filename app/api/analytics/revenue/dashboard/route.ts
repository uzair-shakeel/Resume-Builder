import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/subscription.model";
import mongoose from "mongoose";

interface MonthlyRevenue {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
}

interface RevenueBySource {
  _id: string;
  revenue: number;
}

interface MonthlyBreakdown {
  month: string;
  revenue: number;
  users: number;
  payingUsers: number;
  arpu: number;
  conversionRate: number;
}

export async function GET() {
  try {
    await dbConnect();

    // Debug: First check all subscriptions
    const allSubscriptions = await Subscription.find({});
    console.log("Total subscriptions in database:", allSubscriptions.length);
    console.log("Sample subscription:", allSubscriptions[0]);

    // Debug: Check all possible status values
    const distinctStatus = await Subscription.distinct("status");
    console.log("All possible status values:", distinctStatus);

    // Get current date and start of month 11 months ago
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const elevenMonthsAgo = new Date(now);
    elevenMonthsAgo.setMonth(now.getMonth() - 11);
    elevenMonthsAgo.setDate(1);
    elevenMonthsAgo.setHours(0, 0, 0, 0);

    // Calculate total revenue from active subscriptions
    const totalRevenue = await Subscription.aggregate<{
      _id: null;
      total: number;
    }>([
      {
        $match: { status: "active" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $divide: ["$amount", 100] } },
        },
      },
    ]);
    console.log("Total revenue (active subscriptions):", totalRevenue);

    // Get monthly breakdown for the last 12 months
    const monthlyBreakdown: MonthlyBreakdown[] = [];
    const months = [];

    // Generate array of last 12 months
    for (let i = 0; i < 12; i++) {
      const date = new Date(now);
      date.setMonth(now.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      // Get revenue for this month
      const monthRevenue = await Subscription.aggregate<{
        _id: null;
        total: number;
      }>([
        {
          $match: {
            status: "active",
            startDate: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $divide: ["$amount", 100] } },
          },
        },
      ]);

      // Get users for this month
      const monthUsers = await Subscription.distinct("userId", {
        startDate: {
          $lte: endOfMonth,
        },
      });

      // Get paying users for this month
      const monthPayingUsers = await Subscription.distinct("userId", {
        status: "active",
        startDate: {
          $lte: endOfMonth,
        },
      });

      const revenue = monthRevenue[0]?.total || 0;
      const users = monthUsers.length;
      const payingUsers = monthPayingUsers.length;
      const arpu = users > 0 ? revenue / users : 0;
      const conversionRate = users > 0 ? (payingUsers / users) * 100 : 0;

      monthlyBreakdown.push({
        month: startOfMonth.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        revenue,
        users,
        payingUsers,
        arpu,
        conversionRate,
      });
    }

    // Calculate monthly average
    const monthlyAverage =
      monthlyBreakdown.reduce((acc, curr) => acc + curr.revenue, 0) /
      monthlyBreakdown.length;

    // Calculate latest month revenue
    const latestMonthRevenue = monthlyBreakdown[0]?.revenue || 0;

    // Calculate overall metrics
    const uniqueUsers = (await Subscription.distinct(
      "userId"
    )) as mongoose.Types.ObjectId[];
    const totalUsers = uniqueUsers.length;

    const uniquePayingUsers = (await Subscription.distinct("userId", {
      status: "active",
    })) as mongoose.Types.ObjectId[];
    const payingUsers = uniquePayingUsers.length;

    const arpu = totalRevenue[0]?.total
      ? totalRevenue[0].total / totalUsers
      : 0;
    const arppu = totalRevenue[0]?.total
      ? totalRevenue[0].total / payingUsers
      : 0;
    const conversionRate = (payingUsers / (totalUsers || 1)) * 100;

    // Get revenue by subscription type
    const revenueByType = await Subscription.aggregate<RevenueBySource>([
      {
        $match: { status: "active" },
      },
      {
        $group: {
          _id: { plan: "$plan", type: "$type" },
          revenue: { $sum: { $divide: ["$amount", 100] } },
        },
      },
    ]);

    const response = {
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyAverage,
      latestMonthRevenue,
      arpu,
      arppu,
      conversionRate,
      monthlyBreakdown,
      revenueBySource: revenueByType,
      currency: "USD",
      debug: {
        totalSubscriptions: allSubscriptions.length,
        distinctStatus,
        totalRevenueAllStatuses: totalRevenue[0]?.total || 0,
        totalUsers,
        payingUsers,
      },
    };

    console.log("Final response:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Revenue Dashboard Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch revenue analytics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
