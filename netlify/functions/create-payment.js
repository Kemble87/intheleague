// netlify/functions/create-payment.js
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { uid, email } = JSON.parse(event.body || "{}");

    const res = await fetch("https://api-v2.ziina.com/api/payment_intent", { // CHECK DOCS: endpoint
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.ZIINA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 7000, // CHECK DOCS: amount in fils — 7000 = AED 70.00
        currency_code: "AED",
        message: `InTheLeague Season Pass 26/27${email ? " - " + email : ""}`,
        success_url: "https://intheleague.app/?paid=success",
        cancel_url: "https://intheleague.app/?paid=cancelled",
        test: false, // CHECK DOCS: set true while testing if supported
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Ziina error:", data);
      return { statusCode: 502, body: JSON.stringify({ error: "Payment setup failed" }) };
    }

    // CHECK DOCS: field name for the hosted checkout URL
    return {
      statusCode: 200,
      body: JSON.stringify({ url: data.redirect_url, id: data.id }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
}
