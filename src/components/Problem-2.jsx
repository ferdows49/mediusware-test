import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Problem2 = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [allContacts, setAllContacts] = useState([]);
  const [usContacts, setUsContacts] = useState([]);
  const [onlyEven, setOnlyEven] = useState(false);
  const [evenAllContacts, setEvenAllContacts] = useState([]);
  const [evenUsContacts, setEvenUsContacts] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [searchBy, setSearchBy] = useState("");

  const containerRef = useRef(null);

  const navigate = useNavigate();

  const openModal = (type) => {
    if (type === "all-contacts") {
      navigate("/problem-2/all-contacts");
    } else if (type === "us-contacts") {
      navigate("/problem-2/us-contacts");
    }
    setPageSize(20);
    setSearchBy("");
    setModalType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    navigate("/problem-2");
    setPageSize(20);
    setSearchBy("");
    setModalType("");
    setShowModal(false);
  };

  const fetchApi = (type) => {
    let url = "https://contact.mediusware.com/api";

    if (type === "all-contacts") {
      url = url + `/contacts/?page=1&page_size=${pageSize}&search=${searchBy}`;
    } else if (type === "us-contacts") {
      url =
        url +
        `/country-contacts/United%20States/?page=1&page_size=${pageSize}&search=${searchBy}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (type === "all-contacts") {
          setAllContacts(data?.results);
        } else if (type === "us-contacts") {
          setUsContacts(data?.results);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleOnlyEven = (e) => {
    if (e.target.checked) {
      setOnlyEven(true);
      if (modalType === "all-contacts") {
        const filteredAllContacts = allContacts?.filter(
          (contact) => contact?.id % 2 === 0
        );
        setEvenAllContacts(filteredAllContacts);
      } else if (modalType === "us-contacts") {
        const filteredUsContacts = usContacts?.filter(
          (contact) => contact?.id % 2 === 0
        );
        setEvenUsContacts(filteredUsContacts);
      }
    } else {
      setOnlyEven(false);
      setEvenAllContacts([]);
      setEvenUsContacts([]);
    }
  };

  const handleSearch = (e) => {
    if (e.target.value) {
      if (e.key === "Enter") {
        setSearchBy(e.target.value);
        setPageSize(20);
      } else {
        setTimeout(() => {
          setSearchBy(e.target.value);
          setPageSize(20);
        }, 1000);
      }
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight
      ) {
        if (!onlyEven) {
          setPageSize(pageSize + 20);
        }
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [modalType, onlyEven, pageSize]);

  useEffect(() => {
    if (modalType === "all-contacts") {
      fetchApi("all-contacts");
    } else if (modalType === "us-contacts") {
      fetchApi("us-contacts");
    }
  }, [modalType, searchBy, pageSize]);

  useEffect(() => {
    fetchApi("all-contacts");
    fetchApi("us-contacts");
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-outline-primary"
            type="button"
            onClick={() => openModal("all-contacts")}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-outline-warning"
            type="button"
            onClick={() => openModal("us-contacts")}
          >
            US Contacts
          </button>
        </div>
      </div>

      {showModal && modalType === "all-contacts" && (
        <div
          className="modal"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(210, 215, 211, 0.3)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div className="d-flex justify-content-center gap-3">
                  <button
                    style={{ backgroundColor: "#46139f", color: "#fff" }}
                    className="btn btn-lg btn-outline-primary"
                    type="button"
                    onClick={() => openModal("all-contacts")}
                  >
                    All Contacts
                  </button>
                  <button
                    style={{ backgroundColor: "#ff7f50", color: "#fff" }}
                    className="btn btn-lg btn-outline-warning"
                    type="button"
                    onClick={() => openModal("us-contacts")}
                  >
                    US Contacts
                  </button>
                  <button
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #46139f",
                    }}
                    className="btn btn-lg btn-outline-warning"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>

                <input
                  className="form-control my-4"
                  type="number"
                  placeholder="Search contact number..."
                  aria-label="default input example"
                  onKeyDown={(e) => handleSearch(e)}
                />

                <div
                  ref={containerRef}
                  style={{ height: "300px", overflow: "auto" }}
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Country</th>
                        <th scope="col">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onlyEven
                        ? evenAllContacts?.map((contact) => (
                            <tr
                              key={contact?.id}
                              style={{ cursor: "pointer" }}
                              onClick={() => openModal("contact-details")}
                            >
                              <th scope="row">{contact?.id}</th>
                              <td>{contact?.country?.name}</td>
                              <td>{contact?.phone}</td>
                            </tr>
                          ))
                        : allContacts?.map((contact) => (
                            <tr
                              key={contact?.id}
                              style={{ cursor: "pointer" }}
                              onClick={() => openModal("contact-details")}
                            >
                              <th scope="row">{contact?.id}</th>
                              <td>{contact?.country?.name}</td>
                              <td>{contact?.phone}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={onlyEven}
                    onChange={(e) => handleOnlyEven(e)}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Only even
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && modalType === "us-contacts" && (
        <div
          className="modal"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(210, 215, 211, 0.3)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div className="d-flex justify-content-center gap-3">
                  <button
                    style={{ backgroundColor: "#46139f", color: "#fff" }}
                    className="btn btn-lg btn-outline-primary"
                    type="button"
                    onClick={() => openModal("all-contacts")}
                  >
                    All Contacts
                  </button>
                  <button
                    style={{ backgroundColor: "#ff7f50", color: "#fff" }}
                    className="btn btn-lg btn-outline-warning"
                    type="button"
                    onClick={() => openModal("us-contacts")}
                  >
                    US Contacts
                  </button>
                  <button
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #46139f",
                    }}
                    className="btn btn-lg btn-outline-warning"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>

                <input
                  className="form-control my-4"
                  type="number"
                  placeholder="Search contact number..."
                  aria-label="default input example"
                  onKeyDown={(e) => handleSearch(e)}
                />

                <div
                  ref={containerRef}
                  style={{ height: "300px", overflow: "auto" }}
                >
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Country</th>
                        <th scope="col">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onlyEven
                        ? evenUsContacts?.map((contact) => (
                            <tr
                              key={contact?.id}
                              style={{ cursor: "pointer" }}
                              onClick={() => openModal("contact-details")}
                            >
                              <th scope="row">{contact?.id}</th>
                              <td>{contact?.country?.name}</td>
                              <td>{contact?.phone}</td>
                            </tr>
                          ))
                        : usContacts?.map((contact) => (
                            <tr
                              key={contact?.id}
                              style={{ cursor: "pointer" }}
                              onClick={() => openModal("contact-details")}
                            >
                              <th scope="row">{contact?.id}</th>
                              <td>{contact?.country?.name}</td>
                              <td>{contact?.phone}</td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={onlyEven}
                    onChange={(e) => handleOnlyEven(e)}
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Only even
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && modalType === "contact-details" && (
        <div
          className="modal"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(210, 215, 211, 0.3)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div className="d-flex justify-content-center gap-3">
                  <button
                    style={{ backgroundColor: "#46139f", color: "#fff" }}
                    className="btn btn-lg btn-outline-primary"
                    type="button"
                    onClick={() => openModal("all-contacts")}
                  >
                    All Contacts
                  </button>
                  <button
                    style={{ backgroundColor: "#ff7f50", color: "#fff" }}
                    className="btn btn-lg btn-outline-warning"
                    type="button"
                    onClick={() => openModal("us-contacts")}
                  >
                    US Contacts
                  </button>
                  <button
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #46139f",
                    }}
                    className="btn btn-lg btn-outline-warning"
                    type="button"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>

                <div
                  style={{ height: "300px", overflow: "auto", padding: "20px" }}
                >
                  <div class="card border-0">
                    <div class="card-body">
                      <h5 class="card-title">Contact Details</h5>
                      <p class="card-text">Name: Ferdows</p>
                      <p class="card-text">Email: ferdows@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Problem2;
