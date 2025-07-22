<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        /**
         * @todo
         * 1. Clean up and select only relevant categories
         */
        $categories = collect([
            "Salary",
            "Bonus",
            "Freelance/Contract Work",
            "Rental Income",
            "Dividends",
            "Interest Income",
            "Business Revenue",
            "Gifts/Windfalls",
            "Refunds & Reimbursements",

            "Rent",
            "Mortgage",
            "Property Taxes",
            "Home Insurance",
            "Repairs & Maintenance",
            "Utilities (Water, Gas, Electricity)",
            "HOA Fees",

            "Fuel",
            "Public Transit",
            "Car Payment",
            "Car Insurance",
            "Maintenance & Repairs",
            "Parking & Tolls",

            "Groceries",
            "Restaurants",
            "Coffee & Snacks",
            "Alcohol & Bars",
            "Takeout/Delivery",

            "Health Insurance",
            "Medical Bills",
            "Dental & Vision",
            "Prescriptions",
            "Therapy/Counseling",
            "Gym Membership",

            "Tuition",
            "Books & Supplies",
            "Student Loans",
            "Courses/Online Learning",

            "Subscriptions (Netflix, Spotify, etc.)",
            "Movies, Games, Events",
            "Hobbies",
            "Travel & Vacations",
            "Sports & Outdoor Activities",

            "Clothing",
            "Electronics",
            "Home Goods",
            "Gifts",
            "Beauty & Personal Care",

            "Internet",
            "Mobile Phone",
            "Software & Apps",
            "Cloud Storage",

            "Pet Food",
            "Vet Visits",
            "Grooming",
            "Supplies",

            "Credit Card Payments",
            "Loan Repayments",
            "Interest Charges",
            "Late Fees",

            "Emergency Fund",
            "Retirement Contributions (401k, IRA)",
            "Stock Purchases",
            "Crypto Investments",
            "Real Estate Investment",
            "Savings Account Transfer",

            "Income Tax",
            "Property Tax",
            "Self-Employment Tax",
            "Tax Filing Services",

            "Charitable Contributions",
            "Religious Giving",
            "Family Support",

            "Bank Fees",
            "Currency Exchange",
            "Unknown Transactions",
            "Uncategorized",

            "Transfer Fee",
        ]);

        $categories->each(fn (string $category) => Category::updateOrCreate([
            "title" => $category,
            "key" => Str::slug($category, "-"),
        ]));
    }
}
