import React, { useState, useEffect } from 'react';
import { CCol, CFormInput, CFormLabel, CButton, CFormTextarea, CFormSelect } from '@coreui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from '../../components/Form/Form';
import { useParams } from 'react-router-dom';

function EditMember() {
  const { id } = useParams(); // Get the ID from the URL
  // const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    validityDays: '',
    level: '',
    includes: '',
    whatIsThis: '',
    active: true,
  });

  // Fetch the membership plan details when the component mounts
  useEffect(() => {
    const fetchMembershipPlan = async () => {
      try {
        const res = await axios.get(`http://localhost:7000/api/v1/membership-plans/${id}`);
        setFormData({
          title: res.data.data.title,
          price: res.data.data.price,
          description: res.data.data.description,
          validityDays: res.data.data.validityDays,
          level: res.data.data.level,
          includes: res.data.data.includes.join(', '), // Join the array into a comma-separated string
          whatIsThis: res.data.data.whatIsThis,
          active: res.data.data.active,
        });
      } catch (error) {
        console.error('Error fetching membership plan:', error);
        toast.error('Failed to fetch membership plan.');
      }
    };
    
    fetchMembershipPlan();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Submit the updated form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure `includes` is an array of strings (split by commas)
    const includesArray = formData.includes.split(',').map(item => item.trim());

    const formDataToSend = { ...formData, includes: includesArray };

    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:7000/api/v1/membership-plans/${id}`, formDataToSend);
      toast.success(res.data.message);
      // history.push('/membership-plans'); // Redirect to the membership plans list page
    } catch (error) {
      console.error('Error submitting updated membership plan:', error);
      toast.error(error?.response?.data?.message || 'Failed to update membership plan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      heading="Edit Membership Plan"
      btnText="Back"
      btnURL="/membership-plans"
      onSubmit={handleSubmit}
      formContent={
        <>
          <CCol md={12}>
            <CFormLabel htmlFor="title">Title</CFormLabel>
            <CFormInput
              id="title"
              name="title"
              placeholder="Enter Membership Plan title"
              value={formData.title}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="price">Price</CFormLabel>
            <CFormInput
              id="price"
              name="price"
              type="number"
              placeholder="Enter Membership Plan price"
              value={formData.price}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="description">Description</CFormLabel>
            <CFormTextarea
              id="description"
              name="description"
              placeholder="Enter Membership Plan description"
              value={formData.description}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="validityDays">Validity (in days)</CFormLabel>
            <CFormInput
              id="validityDays"
              name="validityDays"
              type="number"
              placeholder="Enter validity in days"
              value={formData.validityDays}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="level">Level</CFormLabel>
            <CFormSelect
              id="level"
              name="level"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
            >
              <option value="">Select Level</option>
              <option value="1">Basic</option>
              <option value="2">Premium</option>
              <option value="3">VIP</option>
            </CFormSelect>
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="includes">Includes (use comma to separate)</CFormLabel>
            <CFormTextarea
              id="includes"
              name="includes"
              placeholder="Enter included features"
              value={formData.includes}
              onChange={handleChange}
            />
          </CCol>
          <CCol md={12} className="mt-3">
            <CFormLabel htmlFor="whatIsThis">What is this?</CFormLabel>
            <CFormTextarea
              id="whatIsThis"
              name="whatIsThis"
              placeholder="Enter details about the plan"
              value={formData.whatIsThis}
              onChange={handleChange}
            />
          </CCol>
          <CCol xs={12} className="mt-4">
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Please Wait...' : 'Submit'}
            </CButton>
          </CCol>
        </>
      }
    />
  );
}

export default EditMember;