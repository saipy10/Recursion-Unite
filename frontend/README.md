
# BankFlow FinTrack

**BankFlow FinTrack** is an expense tracker and transaction analyzer app that helps users track and manage their financial transactions. The app provides intuitive features such as budget suggestions, heatmap calendar visualization, transaction insights, and detailed transaction management.

## Features

- **Transaction Management**: View, filter, and sort transactions, download transaction data as CSV, and view detailed information about each transaction.
- **Heatmap Calendar**: A calendar that visualizes your spending habits, with each day marked by a heatmap based on transaction data. Clicking on a day shows the related transactions.
- **Insights Dashboard**: Analyzes spending patterns and trends using Google Gemini AI, showing insights like spending categories (e.g., Grocery, Entertainment, Medical) and financial habits.
- **Budget Suggestions**: Using Google Gemini API, the app provides suggestions for optimizing your spending habits based on historical data.
- **User Authentication**: Secure login system that generates a token for session management.
- **Responsive UI**: Built with React and Vite, ensuring a fast, responsive user experience.
  
## Tech Stack

- **Frontend**:
  - React
  - Vite
  - Syncfusion (for grid views and charts)
  - ReactMarkdown (for displaying insights)

- **Backend**:
  - Flask
  - MongoDB
  - Google Gemini API for budget suggestions

## Installation

### Prerequisites

- Node.js
- Python 3.x
- MongoDB (local or cloud instance)

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/bankflow-fintrack.git
   cd bankflow-fintrack
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser at `http://localhost:3000`.

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/saipy10/bankflow-fintrack-backend.git
   cd bankflow-fintrack-backend
   ```

2. Create a virtual environment and activate it:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up MongoDB (you can use a local or cloud instance) and update the `config.py` file with your MongoDB connection details.

5. Run the Flask backend:

   ```bash
   python app.py
   ```

6. The backend will run on `http://localhost:5000`.

## Endpoints

### Authentication

- **POST** `/api/auth/login`: Logs the user in and returns a token for authentication.
- **POST** `/api/auth/logout`: Logs the user out.

### Transactions

- **GET** `/api/transactions`: Fetches a list of all transactions.
- **GET** `/api/transactions/:id`: Fetches a specific transaction by ID.
- **POST** `/api/transactions`: Creates a new transaction.

### Insights

- **GET** `/api/insights`: Fetches spending insights based on the user's transactions.

## Usage

### Login

Use the login endpoint to authenticate users. After successful login, a token will be generated and should be stored locally for further authenticated requests.

### Transaction Management

- View your transaction history in a grid.
- Use filtering, sorting, and paging features to analyze transactions.
- Download your transaction data as a CSV file.

### Calendar Visualization

The calendar heatmap shows a summary of your transactions for each day. The heatmap uses different color intensities to show spending patterns. Clicking on a day will show all transactions for that day.

### Insights & Recommendations

The app provides insights based on your transaction history, such as spending trends and potential savings. You'll also get personalized budget recommendations powered by Google Gemini API.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Syncfusion](https://www.syncfusion.com/)
- [Google Gemini API](https://developers.google.com/gemini)

