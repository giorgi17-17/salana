import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "../../styles/components/BusinessLocations.module.css";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  MapPin,
  Building,
  ExternalLink,
  Camera,
  Star,
} from "lucide-react";

function BusinessLocations({
  businessId,
  initialLocations = [],
  onLocationsChange,
}) {
  const [locations, setLocations] = useState(initialLocations);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    location_url: "",
    image: "",
    is_primary: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setLocations(initialLocations);
  }, [initialLocations]);

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      location_url: "",
      image: "",
      is_primary: false,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "ლოკაციის სახელი აუცილებელია";
    }

    if (!formData.address.trim()) {
      newErrors.address = "მისამართი აუცილებელია";
    }

    // Validate URL format if provided
    if (formData.location_url && formData.location_url.trim()) {
      try {
        new URL(formData.location_url);
      } catch {
        newErrors.location_url = "გთხოვთ შეიყვანოთ სწორი URL";
      }
    }

    // Validate image URL format if provided
    if (formData.image && formData.image.trim()) {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = "გთხოვთ შეიყვანოთ სწორი სურათის URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddLocation = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // If this is being set as primary, first unset all other primary locations
      if (formData.is_primary) {
        await supabase
          .from("business_locations")
          .update({ is_primary: false })
          .eq("business_id", businessId);
      }

      const { data, error } = await supabase
        .from("business_locations")
        .insert([
          {
            business_id: businessId,
            name: formData.name.trim(),
            address: formData.address.trim(),
            location_url: formData.location_url.trim() || null,
            image: formData.image.trim() || null,
            is_primary: formData.is_primary,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setLocations([...locations, data]);
      setIsAddModalOpen(false);
      resetForm();
      onLocationsChange?.();
    } catch (error) {
      console.error("Error adding location:", error);
      setErrors({ submit: "ლოკაციის დამატებისას მოხდა შეცდომა" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocation = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // If this is being set as primary, first unset all other primary locations
      if (formData.is_primary && !editingLocation.is_primary) {
        await supabase
          .from("business_locations")
          .update({ is_primary: false })
          .eq("business_id", businessId)
          .neq("id", editingLocation.id);
      }

      const { data, error } = await supabase
        .from("business_locations")
        .update({
          name: formData.name.trim(),
          address: formData.address.trim(),
          location_url: formData.location_url.trim() || null,
          image: formData.image.trim() || null,
          is_primary: formData.is_primary,
        })
        .eq("id", editingLocation.id)
        .select()
        .single();

      if (error) throw error;

      setLocations(
        locations.map((location) =>
          location.id === editingLocation.id ? data : location
        )
      );
      setEditingLocation(null);
      resetForm();
      onLocationsChange?.();
    } catch (error) {
      console.error("Error updating location:", error);
      setErrors({ submit: "ლოკაციის განახლებისას მოხდა შეცდომა" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (locationId) => {
    if (!window.confirm("დარწმუნებული ხართ, რომ გსურთ ამ ლოკაციის წაშლა?")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("business_locations")
        .delete()
        .eq("id", locationId);

      if (error) throw error;

      setLocations(locations.filter((location) => location.id !== locationId));
      onLocationsChange?.();
    } catch (error) {
      console.error("Error deleting location:", error);
      alert("ლოკაციის წაშლისას მოხდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (location) => {
    setFormData({
      name: location.name,
      address: location.address || "",
      location_url: location.location_url || "",
      image: location.image || "",
      is_primary: location.is_primary || false,
    });
    setEditingLocation(location);
    setErrors({});
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setEditingLocation(null);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>ლოკაციების მართვა</h2>
        <button
          className={styles.addButton}
          onClick={openAddModal}
          disabled={loading}
        >
          <Plus size={20} />
          ლოკაციის დამატება
        </button>
      </div>

      {locations.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <MapPin size={48} />
          </div>
          <h3>ლოკაციები არ არის დამატებული</h3>
          <p>
            დაამატეთ თქვენი პირველი ლოკაცია, რომ მომხმარებლებმა იპოვონ თქვენი
            ბიზნესი
          </p>
          <button className={styles.primaryButton} onClick={openAddModal}>
            <Plus size={20} />
            პირველი ლოკაციის დამატება
          </button>
        </div>
      ) : (
        <div className={styles.locationsGrid}>
          {locations.map((location) => (
            <div key={location.id} className={styles.locationCard}>
              {location.image && (
                <div className={styles.locationImageContainer}>
                  <img
                    src={location.image}
                    alt={location.name}
                    className={styles.locationImage}
                  />
                  {location.is_primary && (
                    <div className={styles.primaryBadge}>
                      <Star size={14} />
                      მთავარი
                    </div>
                  )}
                </div>
              )}

              <div className={styles.locationContent}>
                <div className={styles.locationHeader}>
                  <div className={styles.locationInfo}>
                    <h3 className={styles.locationName}>
                      {location.name}
                      {location.is_primary && !location.image && (
                        <span className={styles.primaryIndicator}>
                          <Star size={16} />
                        </span>
                      )}
                    </h3>
                    <p className={styles.locationAddress}>
                      <MapPin size={14} />
                      {location.address}
                    </p>
                  </div>
                  <div className={styles.locationActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => openEditModal(location)}
                      disabled={loading}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteLocation(location.id)}
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {location.location_url && (
                  <a
                    href={location.location_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.locationLink}
                  >
                    <ExternalLink size={14} />
                    რუკაზე ნახვა
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingLocation) && (
        <div className={styles.modalOverlay} onClick={closeModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {editingLocation ? "ლოკაციის რედაქტირება" : "ახალი ლოკაცია"}
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
                  <Building size={16} />
                  ლოკაციის სახელი
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.name ? styles.inputError : ""
                  }`}
                  placeholder="მაგ: მთავარი ოფისი"
                  disabled={loading}
                />
                {errors.name && (
                  <span className={styles.errorMessage}>{errors.name}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <MapPin size={16} />
                  მისამართი
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${
                    errors.address ? styles.inputError : ""
                  }`}
                  placeholder="მაგ: თბილისი, რუსთაველის გამზირი 12"
                  rows="3"
                  disabled={loading}
                />
                {errors.address && (
                  <span className={styles.errorMessage}>{errors.address}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <ExternalLink size={16} />
                  რუკის ლინკი (არასავალდებულო)
                </label>
                <input
                  type="url"
                  name="location_url"
                  value={formData.location_url}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.location_url ? styles.inputError : ""
                  }`}
                  placeholder="https://maps.google.com/..."
                  disabled={loading}
                />
                {errors.location_url && (
                  <span className={styles.errorMessage}>
                    {errors.location_url}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Camera size={16} />
                  სურათის URL (არასავალდებულო)
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.image ? styles.inputError : ""
                  }`}
                  placeholder="https://example.com/photo.jpg"
                  disabled={loading}
                />
                {errors.image && (
                  <span className={styles.errorMessage}>{errors.image}</span>
                )}
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_primary"
                    checked={formData.is_primary}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                    disabled={loading}
                  />
                  <span className={styles.checkboxText}>
                    <Star size={16} />
                    მთავარი ლოკაცია
                  </span>
                </label>
                <p className={styles.checkboxHelp}>
                  მთავარი ლოკაცია გამოჩნდება პირველ რიგში
                </p>
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
                onClick={
                  editingLocation ? handleEditLocation : handleAddLocation
                }
                disabled={loading}
              >
                <Save size={16} />
                {loading
                  ? "ინახება..."
                  : editingLocation
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

export default BusinessLocations;
