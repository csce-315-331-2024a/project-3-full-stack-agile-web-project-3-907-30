import CustomerView from "@/components/customer/customer-view";
import Head from "next/head";
/**
 * Fetch data and render the contents of a page at request time.
 * 
 * @param {any} context The context of the page.
 * @returns {any} The props of the page.
 */
export async function getServerSideProps(context: any) {
  if (context.req.session.account === undefined) {
    return {
      props: {
        account: null,
      },
    };
  }

  return {
    props: { account: context.req.session.account },
  };
}

/**
 * The home page. This page is accessible to users that are customers, employees, or managers.
 * 
 * @component
 * @returns {JSX.Element} The home page.
 */
export default function Home() {
  return (
    <>
      <Head>
        <title>Rev&apos;s American Grill</title>
      </Head>
      <div className="flex max-h-full items-center overflow-hidden">
        <CustomerView />
      </div>
    </>
  );
}
