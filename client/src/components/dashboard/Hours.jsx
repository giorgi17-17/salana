import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "../../styles/components/BusinessHours.module.css";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Clock,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";

function BusinessHours({ businessId, initialHours = [], onHoursChange }) {
  const [hours, setHours] = useState(initialHours);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHour, setEditingHour] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    selected_days: [],
    open_hour: "",
    open_minute: "",
    close_hour: "",
    close_minute: "",
    is_closed: false,
  });
  const [errors, setErrors] = useState({});

  const daysOfWeek = [
    { value: 0, label: "კვირა", short: "კვ" },
    { value: 1, label: "ორშაბათი", short: "ორშ" },
    { value: 2, label: "სამშაბათი", short: "სამშ" },
    { value: 3, label: "ოთხშაბათი", short: "ოთხშ" },
    { value: 4, label: "ხუთშაბათი", short: "ხუთშ" },
    { value: 5, label: "პარასკევი", short: "პარ" },
    { value: 6, label: "შაბათი", short: "შაბ" },
  ];

  useEffect(() => {
    setHours(initialHours);
  }, [initialHours]);

  const resetForm = () => {
    setFormData({
      selected_days: [],
      open_hour: "",
      open_minute: "",
      close_hour: "",
      close_minute: "",
      is_closed: false,
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate selected days (only for add mode, not edit)
    if (!editingHour && formData.selected_days.length === 0) {
      newErrors.selected_days = "გთხოვთ აირჩიოთ მინიმუმ ერთი დღე";
    }

    if (!formData.is_closed) {
      // Validate open time
      if (!formData.open_hour || formData.open_hour === "") {
        newErrors.open_hour = "გახსნის საათი აუცილებელია";
      } else {
        const openHour = parseInt(formData.open_hour);
        if (isNaN(openHour) || openHour < 0 || openHour > 23) {
          newErrors.open_hour = "საათი უნდა იყოს 0-23 შორის";
        }
      }

      if (!formData.open_minute || formData.open_minute === "") {
        newErrors.open_minute = "გახსნის წუთი აუცილებელია";
      } else {
        const openMinute = parseInt(formData.open_minute);
        if (isNaN(openMinute) || openMinute < 0 || openMinute > 59) {
          newErrors.open_minute = "წუთი უნდა იყოს 0-59 შორის";
        }
      }

      // Validate close time
      if (!formData.close_hour || formData.close_hour === "") {
        newErrors.close_hour = "დახურვის საათი აუცილებელია";
      } else {
        const closeHour = parseInt(formData.close_hour);
        if (isNaN(closeHour) || closeHour < 0 || closeHour > 23) {
          newErrors.close_hour = "საათი უნდა იყოს 0-23 შორის";
        }
      }

      if (!formData.close_minute || formData.close_minute === "") {
        newErrors.close_minute = "დახურვის წუთი აუცილებელია";
      } else {
        const closeMinute = parseInt(formData.close_minute);
        if (isNaN(closeMinute) || closeMinute < 0 || closeMinute > 59) {
          newErrors.close_minute = "წუთი უნდა იყოს 0-59 შორის";
        }
      }

      // Check if close time is after open time
      if (
        formData.open_hour &&
        formData.open_minute &&
        formData.close_hour &&
        formData.close_minute
      ) {
        const openHour = parseInt(formData.open_hour);
        const openMinute = parseInt(formData.open_minute);
        const closeHour = parseInt(formData.close_hour);
        const closeMinute = parseInt(formData.close_minute);

        const openTotalMinutes = openHour * 60 + openMinute;
        const closeTotalMinutes = closeHour * 60 + closeMinute;

        if (closeTotalMinutes <= openTotalMinutes) {
          newErrors.close_hour = "დახურვის დრო უნდა იყოს გახსნის დროის შემდეგ";
        }
      }
    }

    // This validation is now handled at the UI level by filtering dropdown options

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatTimeString = (hour, minute) => {
    const h = String(hour).padStart(2, "0");
    const m = String(minute).padStart(2, "0");
    return `${h}:${m}`;
  };

  const handleAddHour = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const openTime = formData.is_closed
        ? null
        : formatTimeString(formData.open_hour, formData.open_minute);
      const closeTime = formData.is_closed
        ? null
        : formatTimeString(formData.close_hour, formData.close_minute);

      // Create records for all selected days
      const recordsToInsert = formData.selected_days.map((dayOfWeek) => ({
        business_id: businessId,
        day_of_week: dayOfWeek,
        open_time: openTime,
        close_time: closeTime,
        is_closed: formData.is_closed,
      }));

      const { data, error } = await supabase
        .from("business_hours")
        .insert(recordsToInsert)
        .select();

      if (error) throw error;

      setHours([...hours, ...data]);
      setIsAddModalOpen(false);
      resetForm();
      onHoursChange?.();
    } catch (error) {
      console.error("Error adding hours:", error);
      setErrors({ submit: "გრაფიკის დამატებისას მოხდა შეცდომა" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditHour = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const openTime = formData.is_closed
        ? null
        : formatTimeString(formData.open_hour, formData.open_minute);
      const closeTime = formData.is_closed
        ? null
        : formatTimeString(formData.close_hour, formData.close_minute);

      const { data, error } = await supabase
        .from("business_hours")
        .update({
          open_time: openTime,
          close_time: closeTime,
          is_closed: formData.is_closed,
        })
        .eq("id", editingHour.id)
        .select()
        .single();

      if (error) throw error;

      setHours(hours.map((hour) => (hour.id === editingHour.id ? data : hour)));
      setEditingHour(null);
      resetForm();
      onHoursChange?.();
    } catch (error) {
      console.error("Error updating hour:", error);
      setErrors({ submit: "გრაფიკის განახლებისას მოხდა შეცდომა" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHour = async (hourId) => {
    if (!window.confirm("დარწმუნებული ხართ, რომ გსურთ ამ გრაფიკის წაშლა?")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("business_hours")
        .delete()
        .eq("id", hourId);

      if (error) throw error;

      setHours(hours.filter((hour) => hour.id !== hourId));
      onHoursChange?.();
    } catch (error) {
      console.error("Error deleting hour:", error);
      alert("გრაფიკის წაშლისას მოხდა შეცდომა");
    } finally {
      setLoading(false);
    }
  };

  const getAvailableDays = () => {
    const usedDays = hours.map((hour) => hour.day_of_week);
    return daysOfWeek.filter((day) => !usedDays.includes(day.value));
  };

  const openAddModal = () => {
    const availableDays = getAvailableDays();
    if (availableDays.length === 0) {
      alert("ყველა დღისთვის უკვე დაყენებულია გრაფიკი");
      return;
    }
    resetForm();
    // Set the first available day as default
    setFormData((prev) => ({
      ...prev,
      day_of_week: availableDays[0].value,
    }));
    setIsAddModalOpen(true);
  };

  const parseTimeString = (timeString) => {
    if (!timeString) return { hour: "", minute: "" };
    const [hour, minute] = timeString.split(":");
    return {
      hour: hour ? String(parseInt(hour)) : "",
      minute: minute ? String(parseInt(minute)) : "",
    };
  };

  const openEditModal = (hour) => {
    const openTime = parseTimeString(hour.open_time);
    const closeTime = parseTimeString(hour.close_time);

    setFormData({
      selected_days: [hour.day_of_week], // In edit mode, start with current day selected
      open_hour: openTime.hour,
      open_minute: openTime.minute,
      close_hour: closeTime.hour,
      close_minute: closeTime.minute,
      is_closed: hour.is_closed || false,
    });
    setEditingHour(hour);
    setErrors({});
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setEditingHour(null);
    resetForm();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle day selection checkboxes
    if (name === "selected_days") {
      const dayValue = parseInt(value);
      setFormData((prev) => ({
        ...prev,
        selected_days: checked
          ? [...prev.selected_days, dayValue]
          : prev.selected_days.filter((day) => day !== dayValue),
      }));
    }
    // For number inputs, ensure only numbers are allowed
    else if (
      (name.includes("hour") || name.includes("minute")) &&
      type !== "checkbox"
    ) {
      // Allow only numbers
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const getDayLabel = (dayOfWeek) => {
    return daysOfWeek.find((day) => day.value === dayOfWeek)?.label || "";
  };

  const formatTime = (time) => {
    if (!time) return "";
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("ka-GE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Sort hours by day of week
  const sortedHours = [...hours].sort((a, b) => a.day_of_week - b.day_of_week);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>სამუშაო საათების მართვა</h2>
        <button
          className={styles.addButton}
          onClick={openAddModal}
          disabled={loading || getAvailableDays().length === 0}
        >
          <Plus size={20} />
          {getAvailableDays().length === 0
            ? "ყველა დღე დაყენებულია"
            : `გრაფიკის დამატება (${getAvailableDays().length} დღე)`}
        </button>
      </div>

      {hours.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Clock size={48} />
          </div>
          <h3>სამუშაო გრაფიკი არ არის დაყენებული</h3>
          <p>
            დაამატეთ თქვენი სამუშაო საათები, რომ მომხმარებლებმა იცოდნენ როდის
            ხართ ხელმისაწვდომი
          </p>
          <button className={styles.primaryButton} onClick={openAddModal}>
            <Plus size={20} />
            პირველი გრაფიკის დამატება
          </button>
        </div>
      ) : (
        <div className={styles.hoursGrid}>
          {sortedHours.map((hour) => (
            <div key={hour.id} className={styles.hourCard}>
              <div className={styles.hourHeader}>
                <div className={styles.dayInfo}>
                  <Calendar size={16} />
                  <h3 className={styles.dayName}>
                    {getDayLabel(hour.day_of_week)}
                  </h3>
                </div>
                <div className={styles.hourActions}>
                  <button
                    className={styles.editButton}
                    onClick={() => openEditModal(hour)}
                    disabled={loading}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteHour(hour.id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className={styles.timeInfo}>
                {hour.is_closed ? (
                  <div className={styles.closedStatus}>
                    <EyeOff size={16} />
                    <span>დახურულია</span>
                  </div>
                ) : (
                  <div className={styles.openStatus}>
                    <Eye size={16} />
                    <span>
                      {formatTime(hour.open_time)} -{" "}
                      {formatTime(hour.close_time)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(isAddModalOpen || editingHour) && (
        <div className={styles.modalOverlay} onClick={closeModals}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editingHour ? "გრაფიკის რედაქტირება" : "ახალი გრაფიკი"}</h3>
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
                  <Calendar size={16} />
                  {editingHour ? "დღე" : "აირჩიეთ დღეები"}
                </label>
                {editingHour ? (
                  // When editing, show only the current day (read-only)
                  <div className={styles.dayDisplay}>
                    {getDayLabel(editingHour.day_of_week)}
                  </div>
                ) : (
                  // When adding new, show available days as checkboxes
                  <div className={styles.dayCheckboxes}>
                    {getAvailableDays().map((day) => (
                      <label
                        key={day.value}
                        className={styles.dayCheckboxLabel}
                      >
                        <input
                          type="checkbox"
                          name="selected_days"
                          value={day.value}
                          checked={formData.selected_days.includes(day.value)}
                          onChange={handleInputChange}
                          className={styles.dayCheckbox}
                          disabled={loading}
                        />
                        <span className={styles.dayCheckboxText}>
                          {day.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
                {errors.selected_days && (
                  <span className={styles.errorMessage}>
                    {errors.selected_days}
                  </span>
                )}
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="is_closed"
                    checked={formData.is_closed}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                    disabled={loading}
                  />
                  <span className={styles.checkboxText}>
                    <EyeOff size={16} />
                    ამ დღეს დახურულია
                  </span>
                </label>
              </div>

              {!formData.is_closed && (
                <div className={styles.timeSection}>
                  <div className={styles.timeGroup}>
                    <label className={styles.label}>
                      <Clock size={16} />
                      გახსნის დრო
                    </label>
                    <div className={styles.timeInputs}>
                      <div className={styles.timeField}>
                        <input
                          type="text"
                          name="open_hour"
                          value={formData.open_hour}
                          onChange={handleInputChange}
                          className={`${styles.timeInput} ${
                            errors.open_hour ? styles.inputError : ""
                          }`}
                          placeholder="09"
                          maxLength="2"
                          disabled={loading}
                        />
                        <span className={styles.timeLabel}>საათი</span>
                      </div>
                      <span className={styles.timeSeparator}>:</span>
                      <div className={styles.timeField}>
                        <input
                          type="text"
                          name="open_minute"
                          value={formData.open_minute}
                          onChange={handleInputChange}
                          className={`${styles.timeInput} ${
                            errors.open_minute ? styles.inputError : ""
                          }`}
                          placeholder="00"
                          maxLength="2"
                          disabled={loading}
                        />
                        <span className={styles.timeLabel}>წუთი</span>
                      </div>
                    </div>
                    {(errors.open_hour || errors.open_minute) && (
                      <span className={styles.errorMessage}>
                        {errors.open_hour || errors.open_minute}
                      </span>
                    )}
                  </div>

                  <div className={styles.timeGroup}>
                    <label className={styles.label}>
                      <Clock size={16} />
                      დახურვის დრო
                    </label>
                    <div className={styles.timeInputs}>
                      <div className={styles.timeField}>
                        <input
                          type="text"
                          name="close_hour"
                          value={formData.close_hour}
                          onChange={handleInputChange}
                          className={`${styles.timeInput} ${
                            errors.close_hour ? styles.inputError : ""
                          }`}
                          placeholder="18"
                          maxLength="2"
                          disabled={loading}
                        />
                        <span className={styles.timeLabel}>საათი</span>
                      </div>
                      <span className={styles.timeSeparator}>:</span>
                      <div className={styles.timeField}>
                        <input
                          type="text"
                          name="close_minute"
                          value={formData.close_minute}
                          onChange={handleInputChange}
                          className={`${styles.timeInput} ${
                            errors.close_minute ? styles.inputError : ""
                          }`}
                          placeholder="00"
                          maxLength="2"
                          disabled={loading}
                        />
                        <span className={styles.timeLabel}>წუთი</span>
                      </div>
                    </div>
                    {(errors.close_hour || errors.close_minute) && (
                      <span className={styles.errorMessage}>
                        {errors.close_hour || errors.close_minute}
                      </span>
                    )}
                  </div>
                </div>
              )}

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
                onClick={editingHour ? handleEditHour : handleAddHour}
                disabled={loading}
              >
                <Save size={16} />
                {loading
                  ? "ინახება..."
                  : editingHour
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

export default BusinessHours;
