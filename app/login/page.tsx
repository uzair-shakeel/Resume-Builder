import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import React from "react";

const page = () => {
  return (
    <main>
      <Header />
      <div className="bg-background w-full pt-40 pb-32">
        <div className="container">
          <h1 className="text-3xl md:text-5xl font-medium font-header leading-tight md:leading-tight text-gray-900 text-center mb-12">
            Connexion
          </h1>
          <form
            className="bg-white rounded p-5 md:p-10 shadow-around max-w-lg mx-auto"
            id="login-email-form"
          >
            <div className="py-2 ">
              <div className="">
                <div className="flex items-center mb-1">
                  <label
                    htmlFor="login-email"
                    className="flex-grow truncate block font-medium text-gray-600 text-sm"
                  >
                    Adresse e-mail
                  </label>
                </div>
              </div>
              <div className="relative flex flex-row border focus-within:border-brand-400 focus-within:bg-brand-50 rounded text-gray-800 border-transparent bg-gray-100  ">
                <input
                  id="login-email"
                  type="email"
                  autoFocus
                  autoComplete="username"
                  maxLength={1000}
                  required
                  className="flex-1 appearance-none outline-none rounded   py-2 ps-3 text-base pe-3  bg-transparent"
                  value=""
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap flex-row-reverse justify-between">
              <button
                id="login-submit-email"
                className="inline-flex border justify-center rounded-brand relative overflow-hidden max-w-full focus-visible:ring-4 ring-brand-200 items-center bg-brand-500 active:bg-brand-300 can-hover:active:bg-brand-300 text-white border-transparent can-hover:hover:bg-brand-400 font-medium py-2 ps-4 pe-4 text-base outline-none"
                type="submit"
                data-testid=""
              >
                <div className="truncate h-6   ">Suivant</div>
              </button>
              <a
                className="inline-flex border justify-center rounded-brand relative overflow-hidden max-w-full focus-visible:ring-4 ring-brand-200 items-center bg-transparent active:text-gray-400 can-hover:active:text-gray-400 text-gray-700 border-transparent can-hover:hover:text-gray-500 px-0 py-0 underline text-sm font-regular text-sm outline-none"
                href="/app/register"
                data-testid=""
              >
                <div className="truncate    ">Pas encore de compte</div>
              </a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default page;
