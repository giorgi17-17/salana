import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ImageUpload from "../common/ImageUpload";
import styles from "../../styles/components/BusinessInfo.module.css";
import {
  Edit3,
  Save,
  X,
  Building,
  Phone,
  Mail,
  FileText,
  Camera,
} from "lucide-react";

function BusinessInfo({ business, onBusinessChange }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    image: "",
  });
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      name: business?.name || "",
      description: business?.description || "",
      phone: business?.phone || "",
      email: business?.email || "",
      image: business?.image || "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "ბიზნესის სახელი აუცილებელია";
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "გთხოვთ შეიყვანოთ სწორი ელ-ფოსტის მისამართი";
      }
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.phone) || formData.phone.length < 9) {
        newErrors.phone = "გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditBusiness = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("businesses")
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          phone: formData.phone.trim() || null,
          email: formData.email.trim() || null,
          image: formData.image.trim() || null,
        })
        .eq("id", business.id)
        .select()
        .single();

      if (error) throw error;

      setIsEditModalOpen(false);
      resetForm();
      onBusinessChange?.(data);
    } catch (error) {
      console.error("Error updating business:", error);
      setErrors({ submit: "ბიზნესის განახლებისას მოხდა შეცდომა" });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    resetForm();
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: styles.statusPending,
      approved: styles.statusApproved,
      suspended: styles.statusSuspended,
    };

    const statusText = {
      pending: "განხილვაში",
      approved: "დამტკიცებული",
      suspended: "შეჩერებული",
    };

    return (
      <span className={`${styles.statusBadge} ${statusStyles[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  if (!business) {
    return <div className={styles.loading}>იტვირთება...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>ბიზნეს ინფორმაცია</h2>
        <button
          className={styles.editButton}
          onClick={openEditModal}
          disabled={loading}
        >
          <Edit3 size={16} />
          რედაქტირება
        </button>
      </div>

      <div className={styles.businessCard}>
        {business.image && (
          <div className={styles.businessImageContainer}>
            <img
              src={business.image}
              alt={business.name}
              className={styles.businessImage}
            />
          </div>
        )}

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label>სახელი:</label>
            <span>{business.name}</span>
          </div>

          {business.description && (
            <div className={styles.infoItem}>
              <label>აღწერა:</label>
              <span>{business.description}</span>
            </div>
          )}

          <div className={styles.infoItem}>
            <label>ტელეფონი:</label>
            <span>{business.phone || "არ არის მითითებული"}</span>
          </div>

          <div className={styles.infoItem}>
            <label>ელ-ფოსტა:</label>
            <span>{business.email || "არ არის მითითებული"}</span>
          </div>

          <div className={styles.infoItem}>
            <label>სტატუსი:</label>
            {getStatusBadge(business.status)}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>ბიზნეს ინფორმაციის რედაქტირება</h3>
              <button
                className={styles.closeButton}
                onClick={closeModal}
                disabled={loading}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Building size={16} />
                  ბიზნესის სახელი
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.name ? styles.inputError : ""
                  }`}
                  placeholder="ბიზნესის სახელი"
                  disabled={loading}
                />
                {errors.name && (
                  <span className={styles.errorMessage}>{errors.name}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <FileText size={16} />
                  აღწერა (არასავალდებულო)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="ბიზნესის შესახებ მოკლე ინფორმაცია..."
                  rows="4"
                  disabled={loading}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Phone size={16} />
                    ტელეფონი (არასავალდებულო)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.phone ? styles.inputError : ""
                    }`}
                    placeholder="მაგ: +995 555 123456"
                    disabled={loading}
                  />
                  {errors.phone && (
                    <span className={styles.errorMessage}>{errors.phone}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Mail size={16} />
                    ელ-ფოსტა (არასავალდებულო)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.email ? styles.inputError : ""
                    }`}
                    placeholder="ბიზნესი@მაგალითი.com"
                    disabled={loading}
                  />
                  {errors.email && (
                    <span className={styles.errorMessage}>{errors.email}</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Camera size={16} />
                  ბიზნესის სურათი (არასავალდებულო)
                </label>
                <ImageUpload
                  currentImageUrl={formData.image}
                  onImageChange={(url) =>
                    setFormData({ ...formData, image: url })
                  }
                  folder="businesses"
                  placeholder="Upload business image"
                />
              </div>

              {errors.submit && (
                <div className={styles.submitError}>{errors.submit}</div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={closeModal}
                disabled={loading}
              >
                გაუქმება
              </button>
              <button
                className={styles.submitButton}
                onClick={handleEditBusiness}
                disabled={loading}
              >
                <Save size={16} />
                {loading ? "ინახება..." : "შენახვა"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessInfo;
