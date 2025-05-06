# CheckMate - Japanese Samurai Waifu Study App

A beautiful Japanese-themed study app featuring samurai waifus who motivate you to complete your studies.

## Development

To run the development server:
```bash
npm install
npm run dev
```

## Deployment to Netlify

1. Make sure you have the Netlify CLI installed:
   ```bash
   npm install -g netlify-cli
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Deploy to Netlify:
   ```bash
   netlify deploy
   ```
   - When prompted, select "Create & configure a new site"
   - Choose your team
   - Enter a site name (or press enter for a random name)
   - For the publish directory, enter: `dist`

4. Once you're satisfied with the preview, deploy to production:
   ```bash
   netlify deploy --prod
   ```

## Character Images

Place all character images in the `/public/assets/characters/` directory. Here are the character details and AI image generation prompts:

### 1. Sakura (Mathematics)
**Filename**: `sakura.png`
**Prompt**: "A beautiful anime Japanese female mathematics teacher with cherry blossom pink hair, wearing a traditional kimono with subtle mathematical patterns, holding a traditional Japanese fan with equations written on it. She has a calm, wise expression. Soft cherry blossoms in the background. High-quality, detailed anime style."

### 2. Hana (Physics)
**Filename**: `hana.png`
**Prompt**: "An energetic anime Japanese female physics teacher with vibrant blue hair tied in a ponytail, wearing a modern take on a kimono with physics diagrams subtly incorporated into the design. She's holding a traditional Japanese paper lantern that glows with energy. Curious, excited expression. High-quality, detailed anime style."

### 3. Yuki (Computer Science)
**Filename**: `yuki.png`
**Prompt**: "A tech-savvy anime Japanese female programmer with purple hair and glasses, wearing a ninja-inspired outfit with circuit patterns. She's holding a traditional Japanese scroll with code written on it. Focused, intelligent expression. Digital cherry blossoms and code in the background. High-quality, detailed anime style."

### 4. Master Akira (All Subjects)
**Filename**: `akira.png`
**Prompt**: "A wise, older anime Japanese male teacher with gray hair tied in a traditional samurai topknot, wearing elegant traditional robes with subtle patterns representing different academic subjects. He has a dignified, knowledgeable expression and is holding a traditional Japanese brush pen. Mount Fuji in the background. High-quality, detailed anime style."

### 5. Mizuki (Time Management)
**Filename**: `mizuki.png`
**Prompt**: "A precise anime Japanese female time management expert with teal hair in a neat bun, wearing a traditional kimono with clock patterns. She's holding a traditional Japanese hourglass. Organized, efficient expression. Japanese garden with perfectly arranged stones in the background. High-quality, detailed anime style."

### 6. Takeshi (Motivation)
**Filename**: `takeshi.png`
**Prompt**: "An energetic anime Japanese male samurai with spiky red hair, wearing traditional samurai armor. He has an intense, motivational expression and is holding a katana pointed toward the sky. Dynamic pose with energy effects around him. Mount Fuji at sunrise in the background. High-quality, detailed anime style."

### 7. Ren (Relaxation)
**Filename**: `ren.png`
**Prompt**: "A serene anime Japanese male zen master with long black hair, wearing simple traditional robes. He has a peaceful expression and is sitting in a meditation pose near a small rock garden. Soft mist and bamboo in the background. High-quality, detailed anime style."

## Achievement and Background Images

Place these images in the `/public/assets/achievements/` and `/public/assets/backgrounds/` directories:

### Achievement Icons
- `first_steps.png` - A simple scroll with a brush pen
- `streak.png` - A flame symbol
- `focused.png` - A meditation symbol
- `fellowship.png` - A group of samurai silhouettes

### Background Elements
- `waifu-background.jpg` - A serene Japanese landscape with cherry blossoms and mountains
- `sakura-petal.png` - Individual cherry blossom petal for animations
- `lantern.png` - Traditional Japanese paper lantern
- `bird.png` - Silhouette of a Japanese crane
