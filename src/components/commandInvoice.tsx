import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Image, pdf } from '@react-pdf/renderer';
//import { saveAs } from 'file-saver';
import logo from '../assets/images/logo/favicon.png';

import axios from 'axios';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Define interfaces for the command and items (unchanged)
interface Item {
  productId: string;
  productName: string;
  productCategory: string;
  quantity: number;
  productPrice: number;
  productImage: string;
}



interface Command {
    id: string;
    items: Item[];
    total: number;
    deliveryAddress: string;
    tip: number
    discount: number;
    deliveryCost: number;
    finalTotal: number;
    paymentMethod: string;
    date: string;
}

// Define styles using @react-pdf/renderer's StyleSheet.create (unchanged)
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 10,
    objectFit: 'contain'
  },
  section: { marginBottom: 10 },
  label: { fontSize: 10, fontWeight: 'bold', marginBottom: 2 },
  text: { fontSize: 10, marginBottom: 5 },
  table: { marginTop: 20, marginBottom: 20 },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { flex: 1, backgroundColor: '#f3f3f3', padding: 5, fontWeight: 'bold', border: '1px solid #ccc' },
  tableCol: { flex: 1, padding: 5, border: '1px solid #ccc' },
  tableCell: { fontSize: 10 },
  total: { fontSize: 12, fontWeight: 'bold', textAlign: 'right', marginTop: 10 },
  message: { marginTop: 20, fontSize: 12, textAlign: 'center', fontStyle: 'italic' },
});



// CommandInvoice component that takes a command object as a prop
const CommandInvoice: React.FC<{ command: Command }> = ({ command }) => {
  console.log(command);

  const [categories, setCategories] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'category'));
      const categoryMap: { [key: string]: string } = {};
      querySnapshot.forEach((doc) => {
        categoryMap[doc.id] = doc.data().name;
      });
      setCategories(categoryMap);
    };

    fetchCategories();
  }, []);



  useEffect(() => {
    const generatePdfAndSendEmail = async () => {
      if (!command) {
        console.error("Command is null or undefined.");
        return;
      }






      const doc = (
        <Document>
          <Page style={styles.page}>
            <View style={styles.header}>
              <Image src={logo} style={styles.logo} />
              <Text style={styles.title}>Facture</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.text}>{command.date  }</Text>
              <Text style={styles.label}>ID Commande:</Text>
              <Text style={styles.text}>{command.id}</Text>
              <Text style={styles.label}>Méthode de paiement:</Text>
              <Text style={styles.text}>{command.paymentMethod}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Adresse de livraison:</Text>
              <Text style={styles.text}>{command.deliveryAddress}</Text>
              <Text style={styles.label}>Coût de livraison:</Text>
              <Text style={styles.text}>{command.deliveryCost.toFixed(2)} €</Text>
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableColHeader}>Nom du produit</Text>
                <Text style={styles.tableColHeader}>Catégorie</Text>
                <Text style={styles.tableColHeader}>Quantité</Text>
                <Text style={styles.tableColHeader}>Prix Unitaire</Text>
                <Text style={styles.tableColHeader}>Total</Text>
              </View>
              {command.items.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCol}>{item.productName}</Text>
                  <Text style={styles.tableCol}>{categories[item.productCategory] || 'Unknown'}</Text>
                  <Text style={styles.tableCol}>{item.quantity}</Text>
                  <Text style={styles.tableCol}>{item.productPrice.toFixed(2)} €</Text>
                  <Text style={styles.tableCol}>{(item.productPrice * item.quantity).toFixed(2)} €</Text>
                </View>
              ))}
            </View>

            <Text style={styles.total}>Total: {command.finalTotal.toFixed(2)} €</Text>
            <Text style={styles.total}>Remise: {command.discount.toFixed(2)} €</Text>
            <Text style={styles.total}>Montant à payer: {(command.finalTotal - command.discount).toFixed(2)} €</Text>

            <Text style={styles.message}>Merci pour votre confiance en Delivio. Nous sommes heureux de vous servir!</Text>
          </Page>
        </Document>
      );

      const pdfBlob = await pdf(doc).toBlob();

      // Upload the PDF and send the email
      const formData = new FormData();
      formData.append('file', pdfBlob, 'facture.pdf');
      formData.append('email', 'a147chaouch@gmail.com'); // Remplacez par l'email du client

      try {
        const response = await axios.post('http://localhost:3008/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Email sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending email:', error);
        console.log("error")
      }
    };

    generatePdfAndSendEmail();
  }, [command]);

  return null; // or a loading spinner if needed
};

export default CommandInvoice;
