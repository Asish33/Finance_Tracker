# Personal Finance Tracker

A modern web application for tracking personal finances, built with Next.js and MongoDB. Track expenses, visualize spending patterns, and manage budgets with an intuitive interface.

![Personal Finance Tracker](https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200&h=600)

## Features

### Transaction Management
- Add, edit, and delete financial transactions
- Categorize transactions with predefined categories
- Track transaction dates and descriptions
- View detailed transaction history

### Data Visualization
- Monthly expenses bar chart
- Category-wise pie chart
- Real-time budget vs. actual comparison
- Interactive charts powered by Recharts

### Budget Management
- Set monthly budgets by category
- Track spending against budgets
- Receive spending insights and alerts
- Visual budget comparisons

### Dashboard Analytics
- Total expenses overview
- Category breakdown
- Recent transactions
- Top spending categories

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Database**: MongoDB with Mongoose
- **Form Handling**: React Hook Form, Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- MongoDB instance (local or remote)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd personal-finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
├── app/
│   ├── api/           # API routes
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   └── models/       # MongoDB models
├── public/           # Static assets
└── styles/          # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Recharts](https://recharts.org/) for the charting library
- [MongoDB](https://www.mongodb.com/) for the database
- [Next.js](https://nextjs.org/) for the framework
