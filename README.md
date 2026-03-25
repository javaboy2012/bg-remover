# Image Background Remover

A web application that removes backgrounds from images using Remove.bg API. Built with Next.js 14 and deployed on Cloudflare Pages.

## Features

- 🖼️ **Drag & Drop Upload** - Simple interface for uploading images
- ⚡ **Real-time Processing** - Background removal in seconds
- 📱 **Responsive Design** - Works on desktop and mobile
- 🔒 **Privacy Focused** - No image storage, processed in memory
- 🎯 **High Quality** - Powered by Remove.bg's AI technology

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **API**: Remove.bg (background removal service)
- **Deployment**: Cloudflare Pages
- **Styling**: Tailwind CSS, Responsive Design

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Remove.bg API key (free tier: 50 images/month)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd bg-remover
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and add your Remove.bg API key:
```env
REMOVE_BG_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Cloudflare Pages (Recommended)

1. Push your code to GitHub
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
3. Go to **Pages** → **Create a project** → **Connect to Git**
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/`
6. Add environment variable:
   - `REMOVE_BG_API_KEY` = your Remove.bg API key
7. Click **Save and Deploy**

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REMOVE_BG_API_KEY` | Your Remove.bg API key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (for metadata) | No |

## Usage

1. Visit the website
2. Drag & drop an image or click to upload
3. Wait for processing (typically 2-10 seconds)
4. Download the result as PNG with transparent background

### Supported Formats
- JPEG/JPG
- PNG
- WebP

### File Size Limit
- Maximum: 5MB (limited by Cloudflare Functions)

## API Reference

### Remove Background
`POST /api/remove-bg`

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
- Success: `image/png` (binary)
- Error: `application/json` with error message

## Development

### Project Structure
```
bg-remover/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   └── remove-bg/     # Background removal endpoint
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ImageUploader.tsx  # File upload component
├── public/               # Static assets
└── ...config files
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Limitations

- **Free Tier**: 50 images/month (Remove.bg API limit)
- **File Size**: Max 5MB (Cloudflare Functions limit)
- **Processing Time**: Depends on image complexity and API load
- **No Storage**: Images are processed in memory, not saved

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- [Remove.bg](https://www.remove.bg/) for the background removal API
- [Next.js](https://nextjs.org/) for the React framework
- [Cloudflare](https://www.cloudflare.com/pages/) for hosting
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Support

For issues and questions, please open an issue on GitHub.