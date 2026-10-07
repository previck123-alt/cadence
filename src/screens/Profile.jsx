import React, { useEffect, useMemo, useState } from "react";
import styles from "./Profile.module.css";
import { FiCamera } from "react-icons/fi";
import {
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineArrowRightOnRectangle,
  HiOutlinePencilSquare,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Tab from "../components/Bottom.js";
import Header from "../components/Header.js";
import {
  fetchCurrentUser,
  updateCurrentUser,
} from "../store/action/userAppStorage";

const money = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

const maskAccount = (value) => {
  if (!value) return "Not available";
  const text = String(value);
  return text.length > 4
    ? `****${text.slice(-4)}`
    : text;
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    user,
    accounts = [],
  } = useSelector((state) => state.userAuth);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    state: "",
  });

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      setLoading(true);

      const result = await dispatch(fetchCurrentUser());

      if (!mounted) return;

      if (!result?.bool) {
        setError(result?.message || "Unable to load your profile.");
      }

      setLoading(false);
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      country: user?.country || "",
      state: user?.state || "",
    });
  }, [user]);

  const fullName = useMemo(() => {
    return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";
  }, [user]);

  const initials = useMemo(() => {
    const first = user?.firstName?.charAt(0) || "";
    const last = user?.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase() || "US";
  }, [user]);

  const totalBalance = accounts.reduce(
    (sum, account) => sum + Number(account?.Balance || 0),
    0
  );

  const change = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError("First name and last name are required.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const result = await dispatch(
      updateCurrentUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        country: form.country.trim(),
        state: form.state.trim(),
      })
    );

    setSaving(false);

    if (!result?.bool) {
      setError(result?.message || "Unable to save your profile.");
      return;
    }

    setMessage("Your profile has been updated successfully.");
  };

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loader} />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.profileHero}>
        <div className={styles.profileWrapper}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>{initials}</div>

            <button
              type="button"
              className={styles.cameraBtn}
              title="Profile photo"
              onClick={() =>
                setMessage(
                  "Profile photo upload can be connected to your existing image upload flow."
                )
              }
            >
              <FiCamera />
            </button>
          </div>

          <div className={styles.profileInfo}>
            <h2>{fullName}</h2>

            <span className={styles.memberBadge}>
              {user?.emailVerified ? "Verified User" : "Account Member"}
            </span>
          </div>
        </div>
      </section>

      {error && (
        <div className={`${styles.alert} ${styles.error}`}>
          {error}
        </div>
      )}

      {message && (
        <div className={`${styles.alert} ${styles.success}`}>
          {message}
        </div>
      )}

      <section className={styles.infoCard}>
        <div className={styles.infoHeader}>
          <div className={styles.infoTitle}>
            <HiOutlineUser className={styles.headerIcon} />
            <h3>Personal Information</h3>
          </div>
        </div>

        <div className={styles.infoDivider} />

        <InfoRow
          icon={<HiOutlineUser />}
          label="Full Name"
          value={fullName}
        />

        <InfoRow
          icon={<HiOutlineEnvelope />}
          label="Email"
          value={user?.email || "Not available"}
        />

        <InfoRow
          icon={<HiOutlineMapPin />}
          label="Location"
          value={
            [user?.state, user?.country]
              .filter(Boolean)
              .join(", ") || "Not provided"
          }
        />
      </section>

      <section className={styles.accountCard}>
        <div className={styles.accountHeader}>
          <div className={styles.accountHeaderTitle}>
            <HiOutlineCreditCard
              className={styles.accountHeaderIcon}
            />
            <div>
              <h3>Account Details</h3>
              <span>
                {accounts.length} account
                {accounts.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <strong>{money(totalBalance)}</strong>
        </div>

        <div className={styles.accountDivider} />

        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div
              className={styles.accountSection}
              key={account._id}
            >
              <div className={styles.accountTop}>
                <div>
                  <h4>
                    {account.accountType
                      ? account.accountType.toUpperCase()
                      : "ACCOUNT"}
                  </h4>

                  <span>
                    {maskAccount(account.accountNumber)}
                  </span>
                </div>

                <strong>
                  {money(account.Balance)}
                </strong>
              </div>

              <div className={styles.accountInfo}>
                <div className={styles.accountRow}>
                  <p>Account Number</p>
                  <strong>
                    {maskAccount(account.accountNumber)}
                  </strong>
                </div>

                <div className={styles.accountRow}>
                  <p>Available Balance</p>
                  <strong>
                    {money(account.Balance)}
                  </strong>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyAccount}>
            No bank account is currently linked to your profile.
          </div>
        )}
      </section>

      <section className={styles.securityCard}>
        <div className={styles.securityHeader}>
          <div className={styles.securityTitle}>
            <HiOutlineShieldCheck
              className={styles.securityHeaderIcon}
            />
            <h3>Security & Privacy</h3>
          </div>
        </div>

        <div className={styles.securityDivider} />

        <div className={styles.securityBody}>
          <button
            type="button"
            className={styles.passwordBtn}
            onClick={() => navigate("/change-password")}
          >
            <HiOutlineLockClosed />
            <span>Change Password</span>
          </button>

          <button
            type="button"
            className={styles.logoutBtn}
            onClick={() => navigate("/logout")}
          >
            <HiOutlineArrowRightOnRectangle />
            <span>Sign Out</span>
          </button>
        </div>
      </section>

      <section className={styles.editProfileCard}>
        <div className={styles.editProfileHeader}>
          <div className={styles.editProfileTitle}>
            <HiOutlinePencilSquare
              className={styles.editProfileIcon}
            />
            <h3>Edit Profile</h3>
          </div>
        </div>

        <div className={styles.editDivider} />

        <form
          className={styles.editBody}
          onSubmit={saveProfile}
        >
          <div className={styles.formGrid}>
            <div className={styles.editGroup}>
              <label htmlFor="firstName">FIRST NAME</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={change}
                required
              />
            </div>

            <div className={styles.editGroup}>
              <label htmlFor="lastName">LAST NAME</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={change}
                required
              />
            </div>

            <div className={styles.editGroup}>
              <label htmlFor="email">EMAIL</label>
              <input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
              />
              <small>
                Email is managed by your account and cannot be changed here.
              </small>
            </div>

            <div className={styles.editGroup}>
              <label htmlFor="country">COUNTRY</label>
              <input
                id="country"
                name="country"
                type="text"
                value={form.country}
                onChange={change}
                placeholder="Country"
              />
            </div>

            <div className={styles.editGroup}>
              <label htmlFor="state">STATE</label>
              <input
                id="state"
                name="state"
                type="text"
                value={form.state}
                onChange={change}
                placeholder="State"
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.saveProfileBtn}
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </section>

      <Tab />
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className={styles.infoRow}>
    <div className={styles.iconBox}>{icon}</div>

    <div className={styles.infoContent}>
      <span>{label}</span>
      <h4>{value}</h4>
    </div>
  </div>
);

export default Profile;
