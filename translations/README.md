# Translation Files Structure

This directory contains the translation files for the Resume Builder application. Each file corresponds to a specific language and follows the same structure.

## File Structure

The translation files are organized by pages, with each page containing an array of categories:

```json
{
  "PageName": [
    {
      "category": "category_name",
      "description": "Description of what this category is for",
      "translations": {
        "key1": "Translated text 1",
        "key2": "Translated text 2",
        "nested_key": {
          "subkey1": "Nested translated text 1",
          "subkey2": "Nested translated text 2"
        }
      }
    }
  ]
}
```

- **PageName**: The name of the page or section (e.g., "Home", "Builder", "Shared")
- **category**: A unique identifier for the component within that page
- **description**: A description of what this category is for (helps with organization)
- **translations**: An object containing the translation keys and their values

## Current Pages and Categories

The translation files currently include the following pages and categories:

### Home

Components specific to the homepage:

1. **hero** - Main banner on homepage
2. **steps** - How it works section
3. **features** - Features section (Our tools)
4. **reviews** - Reviews section (User testimonials)
5. **makecv** - Create a Resume Online section (Call to action)
6. **faqs** - FAQ section (Frequently Asked Questions)

### Builder

Components specific to the CV builder page:

1. **header** - Header section of the CV builder page
2. **sections** - Section names in the CV builder
3. **custom_sections** - Custom section names that can be added
4. **custom_section_editor** - UI elements for the custom section editor
5. **templates** - Template selection UI
6. **styling** - Styling options for the CV
7. **page_layout** - Page layout settings
8. **pdf_generation** - PDF generation messages
9. **tooltips** - Tooltips and accessibility labels
10. **personal_info_form** - Personal information form fields and labels
11. **profile_form** - Profile section form fields and labels
12. **education_form** - Education section form fields and labels
13. **experience_form** - Experience section form fields and labels
14. **skills_form** - Skills section form fields and labels
15. **languages_form** - Languages section form fields and labels
16. **interests_form** - Interests section form fields and labels
17. **references_form** - References section form fields and labels
18. **socials_form** - Social links section form fields and labels
19. **save_status** - Save status messages
20. **actions** - Action buttons and messages
21. **notifications** - Notification messages

### Templates

Components specific to the templates page:

1. **resume** - Resume templates section

### Shared

Components shared across multiple pages:

1. **navigation** - Header menu items
2. **language** - Language switcher
3. **footer** - Footer section
4. **languages** - Language names for language selector

## Adding New Pages

When adding translations for new pages, follow these steps:

1. **Create a new page section**: Add a new top-level key to the translation files
2. **Add categories**: Add an array of category objects for the new page
3. **Add translations**: Add all the text that needs to be translated in each category

For example, to add translations for a new "About" page:

```json
{
  "About": [
    {
      "category": "about_header",
      "description": "About page header section",
      "translations": {
        "title": "About Us",
        "subtitle": "Our story and mission"
      }
    },
    {
      "category": "about_history",
      "description": "Company history section",
      "translations": {
        "title": "Our History",
        "content": "The story of how we started..."
      }
    },
    {
      "category": "about_team",
      "description": "Team members section",
      "translations": {
        "title": "Our Team",
        "content": "Meet the people behind our service..."
      }
    }
  ]
}
```

4. **Add the same page and categories to all language files**: Make sure to add the new page to all language files (fr.json, en.json, etc.)

## Using Translations in Components

To use translations in a component:

```jsx
import { useLanguage } from "@/contexts/LanguageContext";

export default function MyComponent() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t("about_header.title")}</h1>
      <p>{t("about_header.subtitle")}</p>

      <h2>{t("about_history.title")}</h2>
      <p>{t("about_history.content")}</p>
    </div>
  );
}
```

The `t` function will automatically find the correct category across all pages.

## Best Practices

1. **Organize by pages**: Group related categories under the appropriate page
2. **Use "Shared" for common components**: Place components used across multiple pages in the "Shared" section
3. **Keep keys consistent**: Use the same keys across all language files
4. **Use descriptive keys**: Make keys descriptive of the content they represent
5. **Group related translations**: Use nested objects to group related translations
6. **Add descriptions**: Always add a clear description for each category
