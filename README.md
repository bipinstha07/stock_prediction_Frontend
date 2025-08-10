# Stock Prediction App

A modern, AI-powered stock price prediction application built with Next.js, React, and TypeScript.

## Features

- **AI-Powered Predictions**: Get stock price predictions based on company news and market sentiment
- **Interactive Charts**: Beautiful, responsive charts powered by Recharts
- **User Authentication**: Secure login and signup system
- **Demo Mode**: Try the app without creating an account
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stock-prediction-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

### Demo Mode
- Click "Try Demo" to test the app without signing up
- Enter a stock symbol (e.g., AAPL, GOOGL, TSLA)
- Add relevant company news
- Set prediction timeframe (1-24 months)
- Click "Get Demo Stock Prediction" to see sample data

### Full App
- Sign up for an account or log in
- Access real-time predictions (requires backend API)
- Save and track your predictions
- View detailed analytics and charts

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Authentication**: Custom context-based auth system

## Project Structure

```
stock-prediction-app/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── auth-forms.tsx     # Authentication forms
│   ├── landing-page.tsx   # Landing page
│   ├── navbar.tsx         # Navigation bar
│   └── stock-predictor.tsx # Main stock predictor
├── lib/                   # Utility functions
│   ├── auth.ts            # Authentication logic
│   └── utils.ts           # Helper functions
└── public/                # Static assets
```

## API Integration

The app is designed to work with a backend API for real predictions. In demo mode, it generates sample data. To integrate with a real API:

1. Update the API endpoint in `components/stock-predictor.tsx`
2. Ensure your backend accepts the `NewsStatementDto` format
3. Handle authentication tokens if required

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
