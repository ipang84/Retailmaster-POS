# Complete Workflow Test Guide

This guide will walk you through testing the entire workflow from creating a new product to completing a sale with a new customer.

## Step 1: Create a New Product

1. Navigate to the Products page
2. Click "Add Product" button
3. Fill in the product details:
   - Title: "Premium Bluetooth Headphones"
   - Description: "Wireless over-ear headphones with noise cancellation"
   - Price: 79.99
   - Cost: 45.00
   - Category: Electronics (create if needed)
   - Vendor: "AudioTech" (create if needed)
   - Status: Active
   - Condition: New
   - Check "Track Quantity" and set Quantity to 10
   - Add SKU: "BT-HDPH" (or let it auto-generate)
   - Upload an image if desired

4. Click "Save" to create the product

## Step 2: Verify Product and Inventory

1. Check that the product appears in the Products list
2. Verify that the inventory shows 10 units in stock
3. If needed, update inventory by clicking on the product and using the inventory update modal
4. Add a reason for any inventory updates (e.g., "Initial stock")

## Step 3: Create a New Order

1. Navigate to the Dashboard or Orders page
2. Click "New Order" button
3. Search for the newly created "Premium Bluetooth Headphones" product
4. Add the product to the cart
5. Adjust quantity if needed

## Step 4: Add a New Customer

1. In the order summary section, click "Create Customer"
2. Fill in the customer details:
   - Customer Type: Individual
   - First Name: "Alex"
   - Last Name: "Johnson"
   - Email: "alex.johnson@example.com"
   - Phone: "555-123-4567"
   - Address: "123 Main St"
   - City: "Anytown"
   - State: "CA"
   - Zip Code: "90210"
   - Notes: "First-time customer"

3. Click "Save Customer"
4. Verify that the customer is selected in the dropdown

## Step 5: Complete the Order

1. Add any order notes if needed
2. Apply a discount if desired
3. Ensure tax is calculated correctly
4. Click "Checkout" button
5. Select payment method (e.g., Cash, Card)
6. For cash payment, enter the amount received
7. Click "Complete Order"
8. Verify the success message appears

## Step 6: Verify Order and Customer Data

1. Navigate to the Orders page
2. Verify the new order appears with correct details
3. Navigate to the Customers page
4. Verify the new customer appears with updated order count and amount spent
5. Navigate back to the Products page
6. Verify the inventory for "Premium Bluetooth Headphones" has been reduced by the ordered quantity

## Step 7: Verify Inventory Update

1. Navigate to the Inventory page
2. Check that the "Premium Bluetooth Headphones" shows the correct remaining quantity
3. If applicable, verify that inventory logs show the reduction due to the sale

This completes the full workflow test from product creation to sale completion with a new customer.
