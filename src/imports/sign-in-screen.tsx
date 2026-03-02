Create a Sign In screen for a cattle management app called ChuteSide.

This is a full-screen layout, no app header or navigation — standalone auth screen.

Background: #0E2646 (solid navy, full screen)

Content centered vertically:

1. Brand block (top center):
   - "CHUTESIDE" in Inter 14px font-weight 700, letter-spacing 0.14em, color #F3D12A
   - Below: "Cattle Management" in Inter 12px font-weight 400, color white at 35%
   - 40px below brand block, start the form card

2. Form card:
   - Background: white
   - Border radius: 20px
   - Padding: 28px 24px
   - Width: calc(100% - 40px), max-width 360px, centered
   - Shadow: 0 8px 32px rgba(0,0,0,0.25)

   Inside the card:
   - Title: "Sign In" Inter 22px font-weight 700 color #0E2646, left-aligned
   - Subtitle: "Welcome back" Inter 14px font-weight 400 color #1A1A1A at 40%, 4px below
   - 24px gap

   - Email field:
     - Label: "Email" Inter 13px font-weight 600 color #1A1A1A at 60%, above input
     - Input: full width, 48px height, rounded-xl, border 1.5px #D4D4D0, padding 0 16px, Inter 15px, placeholder "your@email.com" at 30% opacity
     - Focus: border #F3D12A, ring 2px #F3D12A at 25%

   - 16px gap

   - Password field:
     - Label: "Password" Inter 13px font-weight 600 color #1A1A1A at 60%
     - Input: same as email, placeholder "••••••••", with eye icon (16px, #1A1A1A at 25%) on right side for show/hide toggle
   
   - 8px gap
   - "Forgot password?" text link, Inter 13px font-weight 600 color #55BAAA, right-aligned

   - 24px gap

   - Sign In button: full width, 48px height, rounded-full, background #F3D12A, Inter 15px font-weight 700 color #1A1A1A
   
   - 16px gap
   - Divider: line with "or" centered, line color #D4D4D0 at 40%, "or" Inter 12px color #1A1A1A at 30%

   - 16px gap
   - "Continue with Google" button: full width, 48px height, rounded-full, background white, border 1.5px #D4D4D0, Inter 14px font-weight 600 color #1A1A1A at 70%, Google G icon on left (16px)

3. Below the card, 20px gap:
   - "Don't have an account? Sign Up" Inter 13px, "Don't have an account?" in white at 40%, "Sign Up" in #F3D12A font-weight 600

Screen size: 375px wide, full height