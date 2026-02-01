import { MdEmail, MdPhone } from "react-icons/md";

export default function ContactUs() {
  return (
    <div className="container my-5">
      <h2 className="text-dark text-center mb-4" style={{ marginTop: "10%", fontWeight: "bold" }}>
        Contact Us
      </h2>

      <div className="card">
        <div className="card-body">
          <p>
            We'd love to hear from you! Reach out to us using the details below.
          </p>

          <div className="mt-4">
            <p style={{ fontSize: "16px", marginBottom: "0px" }}>
              <MdEmail style={{ marginRight: "10px", color: "#1976d2" }} />
              info@fitnessfirst.com
            </p>

            <p style={{ fontSize: "16px" }}>
              <MdPhone style={{ marginRight: "10px", color: "#1976d2" }} />
              +91 7700037701
            </p>
          </div>

          <p className="mt-4">
            Our support team is available Monday to Sunday, 10AM – 7PM.
          </p>
        </div>
      </div>
    </div>
  );
}
