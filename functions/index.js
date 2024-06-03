const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_51PKTcHP0hvs8yyISIi30WvRX6gexY0WrakzJmUGMwkL6TLSq1PbnhuzgtANjCBK5sc3BdjpiCg2VPEo4msnMHlwO00aEVtD6gd');

admin.initializeApp();

exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  const { amount, currency, items, userId } = data;

  try {
    // Créer un PaymentIntent avec le montant spécifié
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
    });

    return { paymentIntent: paymentIntent.client_secret };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.createOrder = functions.firestore.document('commandes/{commandId}').onCreate(async (snap, context) => {
  const order = snap.data();

  try {
    // Logic to process the order
    // Example: Save order to a different collection or notify the supplier
    console.log('New order created:', order);
  } catch (error) {
    console.error('Error processing order:', error);
  }
});
