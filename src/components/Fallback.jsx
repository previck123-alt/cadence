import React from "react";

const shimmer = {
    background:
        "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)",
    backgroundSize: "200% 100%",
    animation: "loading 1.5s infinite",
};

const Fallback = () => {
    return (
        <>
            <style>
                {`
                    @keyframes loading{
                        0%{background-position:200% 0;}
                        100%{background-position:-200% 0;}
                    }
                `}
            </style>

            <div
                style={{
                    minHeight: "100vh",
                    background: "#f5f7fb",
                    padding: "30px",
                }}
            >
                {/* Header */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "35px",
                    }}
                >
                    <div
                        style={{
                            ...shimmer,
                            width: "240px",
                            height: "45px",
                            borderRadius: "12px",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                        }}
                    >
                        <div
                            style={{
                                ...shimmer,
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                            }}
                        />

                        <div
                            style={{
                                ...shimmer,
                                width: "45px",
                                height: "45px",
                                borderRadius: "50%",
                            }}
                        />
                    </div>
                </div>

                {/* Balance Card */}

                <div
                    style={{
                        ...shimmer,
                        height: "220px",
                        borderRadius: "22px",
                        marginBottom: "30px",
                    }}
                />

                {/* Accounts */}

                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        overflow: "hidden",
                        marginBottom: "35px",
                    }}
                >
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            style={{
                                ...shimmer,
                                minWidth: "280px",
                                height: "150px",
                                borderRadius: "18px",
                                flex: 1,
                            }}
                        />
                    ))}
                </div>

                {/* Transaction Header */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <div
                        style={{
                            ...shimmer,
                            width: "220px",
                            height: "30px",
                            borderRadius: "8px",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                        }}
                    >
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                style={{
                                    ...shimmer,
                                    width: "70px",
                                    height: "36px",
                                    borderRadius: "8px",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Transactions */}

                {Array.from({ length: 7 }).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            padding: "18px",
                            marginBottom: "15px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,.05)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "15px",
                            }}
                        >
                            <div
                                style={{
                                    ...shimmer,
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                }}
                            />

                            <div>
                                <div
                                    style={{
                                        ...shimmer,
                                        width: "170px",
                                        height: "18px",
                                        borderRadius: "6px",
                                        marginBottom: "10px",
                                    }}
                                />

                                <div
                                    style={{
                                        ...shimmer,
                                        width: "120px",
                                        height: "14px",
                                        borderRadius: "6px",
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div
                                style={{
                                    ...shimmer,
                                    width: "110px",
                                    height: "18px",
                                    borderRadius: "6px",
                                    marginBottom: "10px",
                                }}
                            />

                            <div
                                style={{
                                    ...shimmer,
                                    width: "80px",
                                    height: "14px",
                                    borderRadius: "6px",
                                    marginLeft: "auto",
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Fallback;