export interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }
  
  export interface Invoice {
    cid: string;
    createdAt: string;
    id: string;
    metadata: {
      acceptWrapped?: boolean;
      contactEmail: string;
      customerEmail?: string;
      customerName?: string;
      invoiceItems?: InvoiceItem[];
      invoiceTitle?: string;
      invoiceToken: string;
      invoiceTotal: number;
      organization: string;
      record: string;
      signer: string;
    };
  }
  
  // Example usage
//   const exampleInvoice: Invoice = {
//     cid: "QmdeJa4DMZz31JumPPATSaq1ipn83tttzxevr7nPbkkS7C",
//     createdAt: "2023-11-14T21:52:45.444Z",
//     id: "0VwKdYdzvIRk2nlfPjm4",
//     metadata: {
//       acceptWrapped: true,
//       contactEmail: "anigodson20@gmail.com",
//       customerEmail: "kelvinpraises@gmail.com",
//       customerName: "Kelvin",
//       invoiceItems: [
//         { description: 'Toasted Bread', quantity: 5, unitPrice: 20, amount: 100 },
//         { description: 'Coffee', quantity: 2, unitPrice: 15, amount: 30 }
//       ],
//       invoiceTitle: "Breakfast Menu",
//       invoiceToken: "WMATIC (212942045)",
//       invoiceTotal: 130,
//       organization: "HIG-1699996617305-FY1K59",
//       record: "202bdf067662023ad4e8582409868881fdf793fb5fca042a4b91e81a01c0f2fd",
//       signer: "5SOOI356WVD5ZWJ4PCSR34QX7DBAM7G3IKZSHGMPZB2R3OSPI6HQNHG6AE"
//     }
//   };
  

  