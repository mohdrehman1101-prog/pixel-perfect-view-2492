# Replace the menu interface

## What will change
- Keep the uploaded full-screen opening video exactly as supplied; when it ends, open the menu automatically.
- Remove the current menu, category, and item-page styling.
- Rebuild the interface to match the supplied HTML/CSS/JavaScript design: blue café header, search, horizontal “New Menu” cards, animated special section, category filters, catalogue rows, and sliding details view.
- Keep every existing Bake ’N Love dish name and rupee price from the current menu data.
- Keep the current food images and use them within the new visual layout.

## Interactions
- Search filters the existing dishes.
- “View All” scrolls to the full catalogue.
- Category controls filter the catalogue using the existing categories and veg/non-veg status.
- Dish cards and catalogue rows open the new full-screen details view with a smooth slide transition.
- Back closes details smoothly; favourites remain visual-only as in the supplied JavaScript.

## Technical details
- Convert the supplied static HTML/CSS/JavaScript into the existing React app rather than embedding a separate page.
- Preserve existing route metadata and valid detail/category links where appropriate.
- Add the supplied blue, white, and pale-blue styling as semantic design tokens and reproduce its animation timing.
- Verify the intro-to-menu flow, search, filters, dish details, and mobile layout in the live preview.
