import React, { useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css'
//@ts-ignore
import { MortyStackProvider, PayButton } from 'mortystack'

const Reservation: React.FC = () => {
  const [customer, setCustomer] = useState({
    first: "John",
    last: "Doe",
    email: "johndoe@morty.com",
    amount: "700"
  })

  const inputFields = [
    { label: 'Amount', value: `$${customer.amount}`, readOnly: true },
    { label: 'First Name', value: customer.first, readOnly: true },
    { label: 'Last Name', value: customer.last, readOnly: true },
    { label: 'Email', value: customer.email, readOnly: true, type: 'email' },
  ];

  return (
    <MortyStackProvider>
      <div className={styles.container}>
        <Head>
          <title>Pay With Morty</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header className={styles.header}>
          <div className={styles.nav}>
            <div className={styles.title}>
              <div className={styles.iconBg}>
                <img src="/flight.svg" alt="Flight Icon" className={styles.icon} /></div>
              <div> Air Morty </div>
            </div>
            <div>
              <h2>Confirm your flight reservation</h2>
            </div>
            <div>
              <h3>Booking ref: <span>AEF24</span></h3>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.formContainer}>
            {inputFields.map((field, index) => {
              const _style = styles.formRowX;
              return (
                <div className={_style} key={field.label}>
                  <div className={styles.formGroup}>
                    <label>{field.label}:</label>
                    <input
                      value={field.value}
                      readOnly={field.readOnly}
                      type={field.type || 'text'}
                      className={styles.input}
                      placeholder={field.label}
                    />
                  </div>
                </div>
              );
            })}

          </div>

          <div>
            <h1>Pay With</h1>
            <div className={styles.formContainer}>

              <PayButton
                value={{
                  amount: parseInt(customer.amount),
                  email: customer.email
                }}
              />
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <a href='https://github.com/acgodson/mortystack/js-sdk/examples/morty-next' target='_blank'>Source Code</a>
        </footer>
      </div >
    </MortyStackProvider >
  );
};

export default Reservation;
