# The Spend Share 💰🤑

The Spend Share is designed to streamline expense tracking within groups. It enables users to create groups, record transactions, and manage shared costs efficiently. Key features include user authentication for secure access, group creation and management, transaction recording with detailed descriptions, and comprehensive expense reports. With intuitive navigation and robust functionality, the Group Expenses Tracker simplifies group financial management, making it easier for users to track expenses and settle balances effortlessly.

## Features ✨

- **User Authentication**: Secure access through Clerk authentication 🔒.
- **Group Management**: Create, manage, and join groups 👥.
- **Expense Tracking**: Record transactions with detailed descriptions 📑.
- **Reports**: Generate comprehensive expense reports 📊.
- **Responsive Design**: Intuitive navigation and robust functionality across devices 📱💻.

## Table of Contents 📚

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Components](#components)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Installation 🚀

To get started with The Spend Share, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/krishkalaria12/spend-share.git
    cd spend-share
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:** Create a `.env` file in the root directory and add the following environment variables:

    ```bash
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    CLERK_SECRET_KEY=your_clerk_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    WEBHOOK_SECRET=your_webhook_secret
    MONGODB_URL=your_mongodb_url
    UPLOADTHING_SECRET=your_uploadthing_secret
    UPLOADTHING_APP_ID=your_uploadthing_app_id
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables 🌐

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key for authentication.
- `CLERK_SECRET_KEY`: Your Clerk secret key for authentication.
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: The URL for the sign-in page.
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: The URL for the sign-up page.
- `WEBHOOK_SECRET`: Secret for securing webhooks.
- `MONGODB_URL`: Connection string for your MongoDB database.
- `UPLOADTHING_SECRET`: Secret for the upload service.
- `UPLOADTHING_APP_ID`: App ID for the upload service.

## Usage 📖

### User Authentication 🔑

The application uses Clerk for user authentication. Users can sign up and sign in to access the application. Ensure that you have set up the Clerk publishable and secret keys in the environment variables.

### Group Management 👨‍👩‍👧‍👦

Users can create and manage groups. Each group can have multiple members, and users can invite others to join their group.

### Expense Tracking 💸

Within each group, users can record expenses. Each transaction includes a title, description, amount, and category. Users can also mark transactions as paid.

### Reports 📈

Generate detailed reports to see the breakdown of expenses by category and user. This helps in understanding the spending patterns and settling balances.

## Deployment 🚢

To deploy the application, follow these steps:

1. **Build the application:**

    ```bash
    npm run build
    ```

2. **Start the server:**

    ```bash
    npm run start
    ```

3. **Deploy to Vercel:**

    You can deploy this application to Vercel with one click:

    [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=your-template-url)

4. **Deploy to Heroku:**

    Alternatively, you can deploy to Heroku:

    ```bash
    heroku create
    git push heroku main
    heroku config:set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    heroku config:set CLERK_SECRET_KEY=your_clerk_secret_key
    heroku config:set NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    heroku config:set NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    heroku config:set WEBHOOK_SECRET=your_webhook_secret
    heroku config:set MONGODB_URL=your_mongodb_url
    heroku config:set UPLOADTHING_SECRET=your_uploadthing_secret
    heroku config:set UPLOADTHING_APP_ID=your_uploadthing_app_id
    ```

    Open [https://your-app-name.herokuapp.com](https://your-app-name.herokuapp.com) with your browser to see the result.

## Contributing 🤝

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License 📜

This project is licensed under the MIT License

## Acknowledgments 🙌

- Thanks to the [Clerk](https://clerk.dev) team for providing authentication solutions.
- Thanks to [Next.js](https://nextjs.org/) for the powerful framework.
- Thanks to [MongoDB](https://www.mongodb.com/) for the database solution.

Feel free to reach out if you have any questions or need further assistance. Enjoy using The Spend Share! 🎉
