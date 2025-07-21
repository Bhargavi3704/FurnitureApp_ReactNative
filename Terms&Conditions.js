import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const TermsAndConditionsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Terms & Condition</Text>

      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.paragraph}>
      By accessing or using our services, you agree to comply with these Terms and Conditions. If you do not agree, please do not use our services.
      </Text>

      <Text style={styles.sectionTitle}>2. Products and Pricing</Text>
      <Text style={styles.paragraph}>
      We make every effort to display accurate product descriptions, images, and prices.Prices and availability are subject to change without notice.We reserve the right to cancel any order due to errors or stock issues.
      </Text>

      <Text style={styles.sectionTitle}>3. Orders and Payments</Text>
      <Text style={styles.paragraph}>
      Orders are only confirmed once payment is successfully processed.We accept various payment methods, which are listed on our website.In case of payment failure, your order may be delayed or canceled.
      </Text>
      <Text style={styles.sectionTitle}>4. Shipping and Delivery</Text>
      <Text style={styles.paragraph}>
      Estimated delivery times are provided but may vary.We are not responsible for delays caused by shipping carriers or unforeseen circumstances.Shipping fees, if applicable, will be displayed at checkout.
      </Text>

      <Text style={styles.sectionTitle}>5. Returns and Refunds</Text>
      <Text style={styles.paragraph}>
      We offer a return and refund policy, which is detailed on our website.Returned items must be unused, in original condition, and with proof of purchase.Refunds are processed within a specified time frame upon approval.
      </Text>
      <Text style={styles.sectionTitle}>6. User Conduct</Text>
      <Text style={styles.paragraph}>
      You agree not to engage in fraudulent activities, misuse our website, or violate any laws.Any attempt to hack, disrupt, or harm our services is strictly prohibited.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 15,
  },
});

export default TermsAndConditionsScreen;
