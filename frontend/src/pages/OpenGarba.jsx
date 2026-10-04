import { useState } from "react";
import axios from "axios";

function OpenGarba() {

    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "",
        phone: "",
    });

    const [familyMembers, setFamilyMembers] = useState([]);

    const [loading, setLoading] = useState(false);

    const [registrationData, setRegistrationData] = useState(null);

    const [error, setError] = useState("");


    // =========================
    // MAIN FORM CHANGE
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // =========================
    // ADD FAMILY MEMBER
    // =========================

    const addFamilyMember = () => {

        setFamilyMembers((prev) => [
            ...prev,
            {
                name: "",
                age: "",
                gender: ""
            }
        ]);

    };


    // =========================
    // REMOVE FAMILY MEMBER
    // =========================

    const removeFamilyMember = (index) => {

        setFamilyMembers((prev) =>
            prev.filter((_, i) => i !== index)
        );

    };


    // =========================
    // FAMILY MEMBER CHANGE
    // =========================

    const handleFamilyChange = (index, field, value) => {

        setFamilyMembers((prev) =>
            prev.map((member, i) =>
                i === index
                    ? {
                        ...member,
                        [field]: value
                    }
                    : member
            )
        );

    };


    // =========================
    // SUBMIT REGISTRATION
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // Main validation

        if (
            !formData.name ||
            !formData.age ||
            !formData.gender ||
            !formData.phone
        ) {

            setError(
                "Please fill all required fields."
            );

            return;
        }


        // Phone validation

        if (!/^[0-9]{10}$/.test(formData.phone)) {

            setError(
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }


        // Family validation

        for (const member of familyMembers) {

            if (
                !member.name ||
                !member.age ||
                !member.gender
            ) {

                setError(
                    "Please complete all family member details."
                );

                return;
            }

        }


        setLoading(true);


        try {

            const response = await axios.post(
                "http://localhost:5000/api/register",
                {
                    name: formData.name,

                    age: Number(formData.age),

                    gender: formData.gender,

                    phone: formData.phone,

                    familyMembers: familyMembers.map(
                        (member) => ({
                            name: member.name,
                            age: Number(member.age),
                            gender: member.gender
                        })
                    )
                }
            );


            if (response.data.success) {

                setRegistrationData(
                    response.data.data
                );

            } else {

                setError(
                    response.data.message ||
                    "Registration failed."
                );

            }

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // DOWNLOAD QR
    // =========================

    const downloadQR = () => {

        if (!registrationData?.qrCode) {
            return;
        }

        const link = document.createElement("a");

        link.href = registrationData.qrCode;

        link.download =
            `sadgi-garba-${registrationData.name}.png`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

    };


    // =========================
    // SUCCESS SCREEN
    // =========================

    if (registrationData) {

        return (

            <main className="registration-success">

                <div className="success-card">

                    <p className="section-label">
                        ✦ REGISTRATION SUCCESSFUL ✦
                    </p>


                    <h1>
                        You're Registered!
                    </h1>


                    <p className="success-name">
                        Welcome, {registrationData.name}
                    </p>


                    <p className="success-message">

                        Your Open Garba registration has been
                        successfully completed.

                    </p>


                    {/* QR */}

                    <div className="qr-container">

                        <img
                            src={registrationData.qrCode}
                            alt="Open Garba Entry QR"
                        />

                    </div>


                    <p className="qr-instruction">

                        Please save this QR code and show it
                        at the entry desk.

                    </p>


                    {/* DOWNLOAD */}

                    <button
                        className="download-qr-button"
                        onClick={downloadQR}
                    >

                        DOWNLOAD QR

                        <span>
                            ↓
                        </span>

                    </button>


                    <p className="qr-security-note">

                        ✦ Keep this QR safe. It will be required
                        for entry.

                    </p>

                </div>

            </main>

        );
    }


    // =========================
    // REGISTRATION FORM
    // =========================

    return (

        <main className="registration-page">


            {/* =========================
                HEADER
            ========================= */}

            <section className="registration-header">

                <p className="section-label">
                    ✦ ओपन गरबा • OPEN GARBA ✦
                </p>


                <h1>

                    Register For

                    <span>
                        Sadgi Garba Mahotsav.
                    </span>

                </h1>


                <p>

                    Register yourself and your family
                    and be a part of the celebration.

                </p>

            </section>



            {/* =========================
                FORM
            ========================= */}

            <section className="registration-form-section">

                <form
                    className="registration-form"
                    onSubmit={handleSubmit}
                >


                    {/* FORM HEADING */}

                    <div className="form-heading">

                        <h2>
                            Registration Details
                        </h2>

                        <p>
                            Please enter your details carefully.
                        </p>

                    </div>



                    {/* =========================
                        NAME
                    ========================= */}

                    <div className="form-group">

                        <label>
                            Full Name *
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                        />

                    </div>



                    {/* =========================
                        AGE + GENDER
                    ========================= */}

                    <div className="form-row">


                        {/* AGE */}

                        <div className="form-group">

                            <label>
                                Age *
                            </label>

                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Age"
                                min="1"
                                max="100"
                            />

                        </div>


                        {/* GENDER */}

                        <div className="form-group">

                            <label>
                                Gender *
                            </label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>



                    {/* =========================
                        PHONE
                    ========================= */}

                    <div className="form-group">

                        <label>
                            Mobile Number *
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            maxLength="10"
                        />

                    </div>



                    {/* =========================
                        FAMILY MEMBERS
                    ========================= */}

                    <div className="family-section">


                        <div className="family-heading">

                            <div>

                                <h3>
                                    Family Members
                                </h3>

                                <p>
                                    Add family members coming
                                    with you.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="add-family-button"
                                onClick={addFamilyMember}
                            >

                                + ADD MEMBER

                            </button>

                        </div>



                        {/* NO MEMBERS */}

                        {familyMembers.length === 0 && (

                            <div className="no-family">

                                No family members added yet.

                            </div>

                        )}



                        {/* FAMILY MEMBERS */}

                        {familyMembers.map(
                            (member, index) => (

                                <div
                                    className="family-member-row"
                                    key={index}
                                >


                                    {/* NUMBER */}

                                    <div className="family-number">

                                        {index + 1}

                                    </div>


                                    {/* NAME */}

                                    <input
                                        type="text"
                                        placeholder="Member name"
                                        value={member.name}
                                        onChange={(e) =>
                                            handleFamilyChange(
                                                index,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />


                                    {/* AGE */}

                                    <input
                                        type="number"
                                        placeholder="Age"
                                        min="1"
                                        max="100"
                                        value={member.age}
                                        onChange={(e) =>
                                            handleFamilyChange(
                                                index,
                                                "age",
                                                e.target.value
                                            )
                                        }
                                    />


                                    {/* GENDER */}

                                    <select
                                        value={member.gender}
                                        onChange={(e) =>
                                            handleFamilyChange(
                                                index,
                                                "gender",
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Gender
                                        </option>

                                        <option value="Male">
                                            Male
                                        </option>

                                        <option value="Female">
                                            Female
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>


                                    {/* REMOVE */}

                                    <button
                                        type="button"
                                        className="remove-family-button"
                                        onClick={() =>
                                            removeFamilyMember(index)
                                        }
                                    >

                                        ×

                                    </button>

                                </div>

                            )
                        )}

                    </div>



                    {/* =========================
                        ERROR
                    ========================= */}

                    {error && (

                        <div className="registration-error">

                            {error}

                        </div>

                    )}



                    {/* =========================
                        SUBMIT
                    ========================= */}

                    <button
                        type="submit"
                        className="registration-submit"
                        disabled={loading}
                    >

                        {loading
                            ? "REGISTERING..."
                            : "REGISTER FOR OPEN GARBA"
                        }

                        {!loading && (
                            <span>
                                →
                            </span>
                        )}

                    </button>


                    <p className="registration-note">

                        Your QR code will be generated after
                        successful registration.

                    </p>

                </form>

            </section>

        </main>

    );
}

export default OpenGarba;