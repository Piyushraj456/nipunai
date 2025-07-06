// components/pdf/FeedbackDocument.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Use built-in font: Helvetica (NO font registration needed)
const styles = StyleSheet.create({
  body: {
    padding: 20,
    fontFamily: 'Helvetica', // ✅ built-in, no error
    color: '#333',
    lineHeight: 1.5,
  },
  heading: {
    fontSize: 20,
    color: 'green',
    marginBottom: 12,
  },
  metaBox: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: 'green',
  },
  questionBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 6,
  },
  label: {
    fontWeight: 'bold',
  },
  expected: {
    backgroundColor: '#e6ffed',
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
  },
  user: {
    backgroundColor: '#e0f2fe',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
  },
  feedback: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
  },
  rating: {
    backgroundColor: '#fef9c3',
    borderLeftWidth: 4,
    borderLeftColor: '#facc15',
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
  },
});

const FeedbackDocument = ({ meta, feedbackData }) => (
  <Document>
    <Page size="A4" style={styles.body}>
      <Text style={styles.heading}> Interview Feedback Report</Text>

      <View style={styles.metaBox}>
       <Text><Text style={styles.label}>Candidate:</Text> {meta.createdBy}</Text>
<Text><Text style={styles.label}>Role:</Text> {meta.jobPosition}</Text>
<Text><Text style={styles.label}>Experience:</Text> {meta.jobExperience}</Text>
<Text><Text style={styles.label}>Tech:</Text> {meta.techStack}</Text>
<Text><Text style={styles.label}>Description:</Text> {meta.jobDesc}</Text>

      </View>

      {feedbackData.map((item, index) => (
       <View key={index} style={styles.questionBox}>
  <Text>
    <Text style={styles.label}>Q{index + 1}:</Text> {item.question}
  </Text>

  <Text style={styles.expected}>
  
    <Text style={styles.label}>Expected:</Text> {item.correctAns}
  </Text>

  <Text style={styles.user}>
  
    <Text style={styles.label}>Your Answer:</Text> {item.userAns}
  </Text>

  <Text style={styles.feedback}>
 
    <Text style={styles.label}>Feedback:</Text> {item.feedback}
  </Text>

  <Text style={styles.rating}>
 
    <Text style={styles.label}>Rating:</Text> {item.rating}/10
  </Text>
</View>

      ))}
    </Page>
  </Document>
);

export default FeedbackDocument;
