const invoiceTemplate = ({
    order_id,
    order_date,
}) => {
  return `
    
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .invoice-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 10px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #333333;
    }
    .details, .items {
      width: 100%;
      border-collapse: collapse;
    }
    .details th, .items th {
      background-color: #f4f4f4;
      text-align: left;
      padding: 10px;
    }
    .details td, .items td {
      padding: 10px;
      border: 1px solid #e0e0e0;
    }
    .total {
      margin-top: 20px;
      text-align: right;
    }
    .total h3 {
      margin: 0;
      color: #333333;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>Invoice</h1>
      <p>Order ID: {{order_id}}</p>
      <p>Date: {{order_date}}</p>
    </div>
    <table class="details">
      <tr>
        <th>Billing Information</th>
        <th>Shipping Information</th>
      </tr>
      <tr>
        <td>
          Name: {{billing_name}}<br>
          Email: {{billing_email}}<br>
          Phone: {{billing_phone}}<br>
          Address: {{billing_address}}
        </td>
        <td>
          Name: {{shipping_name}}<br>
          Address: {{shipping_address}}
        </td>
      </tr>
    </table>
    <table class="items">
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {{items}}
        Example:
        <tr>
          <td>Product 1</td>
          <td>2</td>
          <td>$10</td>
          <td>$20</td>
        </tr>
       
      </tbody>
    </table>
    <div class="total">
      <h3>Total: ${{ total }}</h3>
    </div>
    <div class="footer">
      Thank you for your purchase! If you have any questions, contact us at {{support_email}}.
    </div>
  </div>
</body>
</html>
    
    `;
};
