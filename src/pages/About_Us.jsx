import { useTheme, useMediaQuery } from "@mui/material";


export default function AboutUs() {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className="container my-5">
      <h2 className="text-dark text-center mb-4" style={{ paddingTop: "10%", fontWeight: "bold" }}>
        About Us
      </h2>

      <div className="card">
        <div className="card-body">
          <p style={{ marginBottom: "0px" }}>
            <strong>Fitness First</strong> is your trusted destination for
            premium fitness supplements, nutrition products, and wellness
            solutions.
          </p>

          <p style={{ marginBottom: "0px" }}>
            We are committed to helping fitness enthusiasts, athletes, and
            beginners achieve their health goals with authentic products from
            top brands.
          </p>

          <p style={{ marginBottom: "0px" }}>
            Our mission is simple —{" "}
            <strong>quality, transparency, and results</strong>. Every product
            we offer goes through strict quality checks to ensure safety and
            effectiveness.
          </p>

          <p style={{ marginBottom: "0px" }}>
            Whether you're building muscle, losing weight, or improving overall
            wellness, Fitness First is here to support your journey.
          </p>
        </div>
      </div>
    </div>
  );
}
