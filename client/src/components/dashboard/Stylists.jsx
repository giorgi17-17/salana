import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import ImageUpload from "../common/ImageUpload";
import styles from "../../styles/components/BusinessStylists.module.css";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  User,
  Award,
  Clock,
  FileText,
  Camera,
} from "lucide-react";

function BusinessStylists({
  businessId,
  initialStylists = [],
  onStylistsChange,
}) {
  const [stylists, setStylists] = useState(initialStylists);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStylist, setEditingStylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    experience: "",
    bio: "",
    image: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setStylists(initialStylists);
  }, [initialStylists]);

  const resetForm = () => {
    setFormData({
      name: "",
      specialty: "",
      experience: "",
      bio: "",
      image: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "სტილისტის სახელი აუცილებელია";
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty = "სპეციალობა აუცილებელია";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "გამოცდილება აუცილებელია";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStylist = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("business_stylists")
        .insert([
          {
            business_id: businessId,
            name: formData.name.trim(),
            specialty: formData.specialty.trim(),
            experience: formData.experience.trim(),
            bio: formData.bio.trim() || null,
            image: formData.image.trim() || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setStylists([...stylists, data]);
      setIsAddModalOpen(false);
      resetForm();
      onStylistsChange?.();
    } catch (error) {
      console.error("Error adding stylist:", error);
      setErrors({ submit: "სტილისტის დამატებისას მოხდა შეცდომა" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditStylist = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("business_stylists")
        .update({
          name: formData.name.trim(),
          specialty: formData.specialty.trim(),
          experience: formData.experience.trim(),
          bio: formData.bio.trim() || null,
          image: formData.image.trim() || null,
        })
        .eq("id", editingStylist.id)
        .select()
        .single();

      if (error) throw error;

      setStylists(
        stylists.map((stylist) =>
          stylist.id === editingStylist.id ? data : stylist
        )
      );
      setEditingStylist(null);
      resetForm();
      onStylistsChange?.();
    } catch (error) {
      console.error("Error updating stylist:", error);
      setErrors({ submit: "სტილისტის განახლებისას მოხდა შეცდომა" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStylist = async (stylistId) => {
    if (!window.confirm("დარწმუნებული ხართ, რომ გსურთ ამ სტილისტის წაშლა?")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("business_stylists")
        .delete()
        .eq("id", stylistId);

      if (error) throw error;

      setStylists(stylists.filter((stylist) => stylist.id !== stylistId));
      onStylistsChange?.();
    } catch (error) {
      console.error("Error deleting stylist:", error);
      alert("სტილისტის წაშლისას მოხდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (stylist) => {
    setFormData({
      name: stylist.name,
      specialty: stylist.specialty || "",
      experience: stylist.experience || "",
      bio: stylist.bio || "",
      image: stylist.image || "",
    });
    setEditingStylist(stylist);
    setErrors({});
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setEditingStylist(null);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>სტილისტების მართვა</h2>
        <button
          className={styles.addButton}
          onClick={openAddModal}
          disabled={loading}
        >
          <Plus size={20} />
          სტილისტის დამატება
        </button>
      </div>

      {stylists.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <User size={48} />
          </div>
          <h3>სტილისტები არ არის დამატებული</h3>
          <p>დაამატეთ თქვენი პირველი სტილისტი, რომ გაზარდოთ გუნდი</p>
          <button className={styles.primaryButton} onClick={openAddModal}>
            <Plus size={20} />
            პირველი სტილისტის დამატება
          </button>
        </div>
      ) : (
        <div className={styles.stylistsGrid}>
          {stylists.map((stylist) => (
            <div key={stylist.id} className={styles.stylistCard}>
              <div className={styles.stylistHeader}>
                <div className={styles.stylistInfo}>
                  {stylist.image ? (
                    <img
                      src={stylist.image}
                      alt={stylist.name}
                      className={styles.stylistImage}
                    />
                  ) : (
                    <div className={styles.defaultAvatar}>
                      <User size={24} />
                    </div>
                  )}
                  <div className={styles.stylistDetails}>
                    <h3 className={styles.stylistName}>{stylist.name}</h3>
                    <p className={styles.stylistSpecialty}>
                      {stylist.specialty}
                    </p>
                  </div>
                </div>
                <div className={styles.stylistActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => openEditModal(stylist)}
                    disabled={loading}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteStylist(stylist.id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.experienceTag}>
                <Clock size={14} />
                <span>{stylist.experience}</span>
              </div>

              {stylist.bio && (
                <p className={styles.stylistBio}>{stylist.bio}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingStylist) && (
        <div className={styles.modalOverlay} onClick={closeModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {editingStylist ? "სტილისტის რედაქტირება" : "ახალი სტილისტი"}
              </h3>
              <button
                className={styles.closeButton}
                onClick={closeModals}
                disabled={loading}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <User size={16} />
                  სტილისტის სახელი
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.name ? styles.inputError : ""
                  }`}
                  placeholder="მაგ: ნინო ზურაბიშვილი"
                  disabled={loading}
                />
                {errors.name && (
                  <span className={styles.errorMessage}>{errors.name}</span>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Award size={16} />
                    სპეციალობა
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.specialty ? styles.inputError : ""
                    }`}
                    placeholder="მაგ: თმის მასტერი"
                    disabled={loading}
                  />
                  {errors.specialty && (
                    <span className={styles.errorMessage}>
                      {errors.specialty}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Clock size={16} />
                    გამოცდილება
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.experience ? styles.inputError : ""
                    }`}
                    placeholder="მაგ: 5+ წელი"
                    disabled={loading}
                  />
                  {errors.experience && (
                    <span className={styles.errorMessage}>
                      {errors.experience}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Camera size={16} />
                  სტილისტის ფოტო (არასავალდებულო)
                </label>
                <ImageUpload
                  currentImageUrl={formData.image}
                  onImageChange={(url) =>
                    setFormData({ ...formData, image: url })
                  }
                  folder="stylists"
                  placeholder="Upload stylist photo"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <FileText size={16} />
                  ბიოგრაფია (არასავალდებულო)
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="სტილისტის შესახებ მოკლე ინფორმაცია..."
                  rows="4"
                  disabled={loading}
                />
              </div>

              {errors.submit && (
                <div className={styles.submitError}>{errors.submit}</div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={closeModals}
                disabled={loading}
              >
                გაუქმება
              </button>
              <button
                className={styles.submitButton}
                onClick={editingStylist ? handleEditStylist : handleAddStylist}
                disabled={loading}
              >
                <Save size={16} />
                {loading
                  ? "ინახება..."
                  : editingStylist
                  ? "განახლება"
                  : "დამატება"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessStylists;
