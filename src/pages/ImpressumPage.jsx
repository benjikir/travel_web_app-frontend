
function ImpressumPage() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-8 mt-8">
        <h1 className="text-3xl font-bold mb-6">Legal Notice</h1>
        
        <div className="space-y-6 text-gray-700">
          <p className="text-sm text-gray-500">Information in accordance with Section 5 TMG</p>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Benjamin Becker</h2>
            <p>Founder of the Travelweb App</p>
            <p>Berlin, Germany</p>
          </section>
          
          <section>
            <h3 className="font-semibold mb-2">Contact Information:</h3>
            <p>Email: contact@travelweb-app.com</p>
            <p>Phone: [01872131235]</p>
          </section>
          
          <section>
            <h3 className="font-semibold mb-2">Responsible for content according to § 55, para. 2 RStV:</h3>
            <p>Benjamin Becker</p>
            <p>Berlin, Germany</p>
          </section>
          
          <section>
            <h3 className="font-semibold mb-2">Copyright Notice:</h3>
            <p className="mb-2">© 2025 Benjamin Becker. All rights reserved.</p>
            <p>All content, design, graphics, and functionality of this Travelweb App are the exclusive property of Benjamin Becker and are protected by international copyright laws.</p>
          </section>
          
          <section>
            <h3 className="font-semibold mb-2">Disclaimer:</h3>
            <p className="mb-2">The contents of our pages have been created with the utmost care. However, we cannot guarantee the accuracy, completeness, and timeliness of the content.</p>
            <p>As service providers, we are liable for our own content on these pages according to general law. However, we are not under obligation to monitor transmitted or stored third-party information or to investigate circumstances indicating illegal activity.</p>
          </section>
          
          <section>
            <h3 className="font-semibold mb-2">Data Protection:</h3>
            <p>Please also refer to our Privacy Policy for information on the processing of personal data.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ImpressumPage;
