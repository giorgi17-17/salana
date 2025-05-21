import styles from "../../styles/components/Testimonials.module.css";

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Emma Thompson",
      image: "/src/assets/testimonial-1.jpg",
      rating: 5,
      text: "Salana completely transformed my salon experience. The booking was seamless, and the stylist was incredible. I've never felt so pampered!",
      service: "Hair Styling",
    },
    {
      id: 2,
      name: "Michael Chen",
      image: "/src/assets/testimonial-2.jpg",
      rating: 5,
      text: "As someone who's always on the go, having a reliable booking platform like Salana has been a game-changer. The massage I booked was exactly what I needed.",
      service: "Massage Therapy",
    },
    {
      id: 3,
      name: "Sofia Rodriguez",
      image: "/src/assets/testimonial-3.jpg",
      rating: 5,
      text: "The attention to detail in the Salana app makes finding and booking wellness services so enjoyable. My facial appointment was perfectly matched to my needs.",
      service: "Facial Treatment",
    },
  ];

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          className={`${styles.star} ${
            i < rating ? styles.starFilled : styles.starEmpty
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <section className={styles.testimonialSection}>
      <div className="container">
        <h2 className={styles.heading}>What Our Clients Say</h2>
        <p className={styles.subheading}>
          Hear from people who've experienced the Salana difference
        </p>

        <div className={styles.testimonialGrid}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={styles.testimonialCard}>
              <div className={styles.cardHeader}>
                <div
                  className={styles.avatar}
                  style={{
                    backgroundImage: `url(${testimonial.image})`,
                  }}
                >
                  {!testimonial.image && (
                    <div className={styles.avatarFallback}>
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={styles.clientInfo}>
                  <h3 className={styles.clientName}>{testimonial.name}</h3>
                  <p className={styles.clientService}>{testimonial.service}</p>
                </div>
              </div>
              <div className={styles.starRating}>
                {renderStars(testimonial.rating)}
              </div>
              <p className={styles.testimonialText}>"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
