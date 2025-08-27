# Cloud Management Platform for PandaMart Kenya

An enterprise-grade cloud management platform with AI-powered features, built specifically for the Kenya market with M-Pesa integration and local optimizations.

## Features

- **Enterprise Authentication**: Admin-only user creation with registration approval workflow
- **AI-Powered Analytics**: Inventory forecasting and dynamic pricing engines
- **M-Pesa Integration**: Complete payment processing with STK Push
- **Multi-Tenant Architecture**: Support for multiple business locations
- **Admin Dashboard**: Comprehensive management interface
- **Kenya Market Optimization**: Local supplier integration and market-specific features

## Quick Start

1. **Clone the repository**
```bash
git clone git@github.com:Cracken-1/cloud_management_platform.git
cd cloud_management_platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment on Vercel

### Prerequisites
- Supabase project with database setup
- Vercel account

### Environment Variables Required
Set these in your Vercel project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_super_secret_jwt_key
```

### Deploy Steps
1. Connect your GitHub repository to Vercel
2. Add the required environment variables
3. Deploy - Vercel will automatically build and deploy

### Database Setup
Run the SQL schema in your Supabase project:
```sql
-- See src/lib/database/auth-schema.sql for complete schema
```

## Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with custom role management
- **Payments**: M-Pesa STK Push integration
- **AI/ML**: Custom forecasting and pricing algorithms
- **Deployment**: Vercel with edge functions

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
