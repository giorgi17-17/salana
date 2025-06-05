import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "../../styles/components/BusinessServices.module.css";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Clock,
  DollarSign,
  Tag,
  FileText,
} from "lucide-react";

function BusinessServices({
  businessId,
  initialServices = [],
  onServicesChange,
}) {
  const [services, setServices] = useState(initialServices);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "სერვისის სახელი აუცილებელია";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "ფასი უნდა იყოს დადებითი რიცხვი";
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "ხანგრძლივობა უნდა იყოს დადებითი რიცხვი";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddService = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("business_services")
        .insert([
          {
            business_id: businessId,
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: parseFloat(formData.price),
            duration: parseInt(formData.duration),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setServices([...services, data]);
      setIsAddModalOpen(false);
      resetForm();
      onServicesChange?.();
    } catch (error) {
      console.error("Error adding service:", error);
      setErrors({ submit: "სერვისის დამატებისას მოხდა შეცდომა" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditService = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("business_services")
        .update({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
        })
        .eq("id", editingService.id)
        .select()
        .single();

      if (error) throw error;

      setServices(
        services.map((service) =>
          service.id === editingService.id ? data : service
        )
      );
      setEditingService(null);
      resetForm();
      onServicesChange?.();
    } catch (error) {
      console.error("Error updating service:", error);
      setErrors({ submit: "სერვისის განახლებისას მოხდა შეცდომა" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("დარწმუნებული ხართ, რომ გსურთ ამ სერვისის წაშლა?")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("business_services")
        .delete()
        .eq("id", serviceId);

      if (error) throw error;

      setServices(services.filter((service) => service.id !== serviceId));
      onServicesChange?.();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("სერვისის წაშლისას მოხდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (service) => {
    setFormData({
      name: service.name,
      description: service.description || "",
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setEditingService(service);
    setErrors({});
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setEditingService(null);
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
        <h2 className={styles.title}>სერვისების მართვა</h2>
        <button
          className={styles.addButton}
          onClick={openAddModal}
          disabled={loading}
        >
          <Plus size={20} />
          სერვისის დამატება
        </button>
      </div>

      {services.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Tag size={48} />
          </div>
          <h3>სერვისები არ არის დამატებული</h3>
          <p>დაამატეთ თქვენი პირველი სერვისი, რომ დაიწყოთ ბუკინგების მიღება</p>
          <button className={styles.primaryButton} onClick={openAddModal}>
            <Plus size={20} />
            პირველი სერვისის დამატება
          </button>
        </div>
      ) : (
        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <div key={service.id} className={styles.serviceCard}>
              <div className={styles.serviceHeader}>
                <h3 className={styles.serviceName}>{service.name}</h3>
                <div className={styles.serviceActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => openEditModal(service)}
                    disabled={loading}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteService(service.id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {service.description && (
                <p className={styles.serviceDescription}>
                  {service.description}
                </p>
              )}

              <div className={styles.serviceDetails}>
                <div className={styles.detailItem}>
                  <DollarSign size={16} />
                  <span>{service.price} ₾</span>
                </div>
                <div className={styles.detailItem}>
                  <Clock size={16} />
                  <span>{service.duration} წუთი</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingService) && (
        <div className={styles.modalOverlay} onClick={closeModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {editingService ? "სერვისის რედაქტირება" : "ახალი სერვისი"}
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
                  <Tag size={16} />
                  სერვისის სახელი
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.name ? styles.inputError : ""
                  }`}
                  placeholder="მაგ: თმის შეჭრა და სტაილინგი"
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
                  placeholder="სერვისის მოკლე აღწერა..."
                  rows="3"
                  disabled={loading}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <DollarSign size={16} />
                    ფასი (₾)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.price ? styles.inputError : ""
                    }`}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                  {errors.price && (
                    <span className={styles.errorMessage}>{errors.price}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Clock size={16} />
                    ხანგრძლივობა (წუთი)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.duration ? styles.inputError : ""
                    }`}
                    placeholder="30"
                    min="1"
                    disabled={loading}
                  />
                  {errors.duration && (
                    <span className={styles.errorMessage}>
                      {errors.duration}
                    </span>
                  )}
                </div>
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
                onClick={editingService ? handleEditService : handleAddService}
                disabled={loading}
              >
                <Save size={16} />
                {loading
                  ? "ინახება..."
                  : editingService
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

export default BusinessServices;
