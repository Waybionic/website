"use client";

const link: string =
  "https://docs.google.com/forms/d/e/1FAIpQLSfITVIipDHmvHqqXcvkUu_8G8pbhNmNpiOy7u506Dgq6aMMUg/viewform";

const hiring: boolean = true;

export default function Join() {
  return (
    <section
      className="w-full flex justify-center items-center py-4 px-6"
      style={{
        background: "linear-gradient(135deg, #e8c4d8 0%, #d4c8f0 100%)",
      }}
      id="join"
    >
      <div className="bg-white rounded-3xl shadow-lg p-16 w-full max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: "#25223b" }}>
          Join Our Team
        </h2>

        {hiring ? (
          <div>
            <p className="text-base mb-8" style={{ color: "#25223b" }}>
              We&apos;re currently accepting applications for various positions. Click below to apply!
            </p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white text-sm px-8 py-3 rounded-full hover:opacity-90 transition"
              style={{ backgroundColor: "#3d316e" }}
            >
              Apply Now
            </a>
          </div>
        ) : (
          <p className="text-base leading-relaxed" style={{ color: "#25223b" }}>
            While we&apos;re not currently accepting applications, we encourage you to keep up with our socials to be notified as soon as recruitment opens!
          </p>
        )}
      </div>
    </section>
  );
}
