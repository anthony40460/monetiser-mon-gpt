import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Stepper, Step, StepLabel, Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, CircularProgress, Tooltip } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  description: Yup.string().required('Description is required'),
  version: Yup.string().required('Version is required'),
  modelType: Yup.string().required('Model type is required'),
  trainingData: Yup.mixed().required('Training data is required'),
});

function CreateGPT() {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      version: '1.0.0',
      modelType: '',
      trainingData: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        for (const key in values) {
          formData.append(key, values[key]);
        }
        await axios.post('http://localhost:5000/api/gpt', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to create GPT. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  const steps = ['Basic Info', 'Advanced Settings', 'Training Data', 'Preview'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="GPT Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              margin="normal"
            />
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              margin="normal"
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              fullWidth
              id="version"
              name="version"
              label="Version"
              value={formik.values.version}
              onChange={formik.handleChange}
              error={formik.touched.version && Boolean(formik.errors.version)}
              helperText={formik.touched.version && formik.errors.version}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="model-type-label">Model Type</InputLabel>
              <Select
                labelId="model-type-label"
                id="modelType"
                name="modelType"
                value={formik.values.modelType}
                onChange={formik.handleChange}
                error={formik.touched.modelType && Boolean(formik.errors.modelType)}
              >
                <MenuItem value="gpt-3">GPT-3</MenuItem>
                <MenuItem value="gpt-4">GPT-4</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case 2:
        return (
          <TextField
            fullWidth
            type="file"
            id="trainingData"
            name="trainingData"
            onChange={(event) => {
              formik.setFieldValue("trainingData", event.currentTarget.files[0]);
            }}
            error={formik.touched.trainingData && Boolean(formik.errors.trainingData)}
            helperText={formik.touched.trainingData && formik.errors.trainingData}
            margin="normal"
          />
        );
      case 3:
        return (
          <div>
            <Typography variant="h6">Preview</Typography>
            <Typography>Name: {formik.values.name}</Typography>
            <Typography>Description: {formik.values.description}</Typography>
            <Typography>Version: {formik.values.version}</Typography>
            <Typography>Model Type: {formik.values.modelType}</Typography>
            <Typography>Training Data: {formik.values.trainingData ? formik.values.trainingData.name : 'No file selected'}</Typography>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <div className="create-gpt">
      <h2>Create New GPT</h2>
      {error && <p className="error">{error}</p>}
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={formik.handleSubmit}>
        {getStepContent(activeStep)}
        <div>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Create GPT'}
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </form>
      <div className="tooltips">
        <Tooltip title="Enter a unique name for your GPT">
          <Typography>Name</Typography>
        </Tooltip>
        <Tooltip title="Provide a detailed description of your GPT's functionality">
          <Typography>Description</Typography>
        </Tooltip>
        <Tooltip title="Select the base model for your GPT">
          <Typography>Model Type</Typography>
        </Tooltip>
        <Tooltip title="Upload custom training data to enhance your GPT's knowledge">
          <Typography>Training Data</Typography>
        </Tooltip>
      </div>
    </div>
  );
}

export default CreateGPT;