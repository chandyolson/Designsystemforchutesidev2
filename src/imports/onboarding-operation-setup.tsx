Create an onboarding screen shown after first sign up, where the user creates their first operation (ranch).

Background: #F5F5F0 (light, not navy — user is now signed in)

Header area:
- Small CHUTESIDE brand: Inter 10px font-weight 700 letter-spacing 0.14em color #F3D12A, top-left with 20px padding
- Progress indicator: 3 dots centered, first dot filled #F3D12A (10px), other two #D4D4D0 (8px), 8px gaps

Content area (20px padding sides):

- 32px from top
- Heading: "Set Up Your Operation" Inter 22px font-weight 700 color #0E2646
- Subtitle: "Tell us about your ranch or practice" Inter 14px font-weight 400 color #1A1A1A at 40%, 4px below

- 28px gap

Form fields — use horizontal label-left layout matching the app style (105px label, flex-1 input):

1. Operation Name (required, red asterisk)
   - Label: "Name"
   - Input: placeholder "Saddle Butte Ranch"

2. Operation Type (required)
   - Label: "Type"
   - Dropdown with options: "Cow-Calf", "Feedlot", "Stocker", "Dairy", "Veterinary Practice", "Other"

3. Address
   - Label: "Address"
   - Input: placeholder "Rural address or nearest town"

4. State
   - Label: "State"  
   - Dropdown

5. Estimated Head Count
   - Label: "Head Count"
   - Number input, placeholder "0"

6. Calving Season
   - Label: "Season"
   - Dropdown: "Spring", "Fall", "Year-Round", "Not Applicable"

- 32px gap

- Continue button: full width, 48px, rounded-full, background #F3D12A, Inter 15px font-weight 700 color #1A1A1A

- 12px gap
- "Skip for now" text link: Inter 13px font-weight 600 color #55BAAA, centered

Bottom of screen:
- "You can always update these in Reference > Operation Profile" Inter 12px color #1A1A1A at 25%, centered, 20px from bottom

Screen size: 375px wide