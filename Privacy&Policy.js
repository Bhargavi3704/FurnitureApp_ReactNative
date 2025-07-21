import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Privacy Policy</Text>

      <Text style={styles.sectionTitle}>1. Information We Collect</Text>
      <Text style={styles.paragraph}>
      Personal Information: Name, email address, phone number, billing/shipping address, payment details.Account Information: Username, password, and preferences if you create an account.Order Details: Purchase history, items added to cart, and transaction records.Usage Information: IP address, device information, browsing activity, and cookies.Customer Support Data: Any information you provide when contacting our support team.
      </Text>

      <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
      <Text style={styles.paragraph}>
      We use your information for the following purposes:To process and fulfill orders, including payments and shipping.To provide customer support and respond to inquiries.To improve our website, mobile app, and services.To personalize your shopping experience based on preferences.To send promotional emails, offers, and updates (you can opt out at any time).To comply with legal and regulatory requirements.
      </Text>

      <Text style={styles.sectionTitle}>3. How We Share Your Information</Text>
      <Text style={styles.paragraph}>
        Sed sollicitudin nisi mollis libero consectetur rutrum. Nam maximus mollis nisi 
        quis facilisis. Integer fermentum commodo nibh. Ut mollis tincidunt hendrerit. 
        Duis ipsum velit, maximus sed commodo imperdiet, dapibus id velit. Nullam in 
        maximus enim. Pellentesque vulputate nisi sit amet lacus pulvinar finibus. 
        Nullam sit amet enim in nibh volutpat gravida vitae in orci.
      </Text>
      <Text style={styles.sectionTitle}>3. How We Share Your Information</Text>
      <Text style={styles.paragraph}>We do not sell your personal information. However, we may share it with:Service Providers: Payment processors, shipping companies, and marketing agencies.Legal Authorities: If required by law or to protect our rights.Business Transfers: In case of a merger, acquisition, or asset sale.
      </Text>
      <Text style={styles.sectionTitle}>4. Data Security</Text>
      <Text style={styles.paragraph}>
      We take reasonable security measures to protect your information from unauthorized access, alteration, or disclosure. However, no data transmission over the internet is completely secure.
      </Text>
      <Text style={styles.sectionTitle}>5. Cookies and Tracking Technologies</Text>
      <Text style={styles.paragraph}>
      We use cookies and similar technologies to enhance your browsing experience and analyze website traffic. You can manage cookie preferences in your browser settings.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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

export default PrivacyPolicyScreen;
