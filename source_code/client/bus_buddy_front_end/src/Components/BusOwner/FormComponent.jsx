import { React } from "react";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Box,
  Button,
  Card,
  FormHelperText,
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useFormik } from "formik";
import { FormComponentSchema } from "./FormComponentSchema";

export default function FormComponent() {
  const onSubmit = () => {
    console.log(formik.values);
  };

  const formik = useFormik({
    initialValues: {
      seatNumber: "",
      seatType: "",
      deck: "",
      seatCost: "",
    },
    validationSchema: FormComponentSchema,
    onSubmit,
  });

  return (
    <div>
      <Card
        sx={{ width: "20rem", margin: 5, border: 1, borderStyle: "dotted" }}
      >
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ margin: 2 }}
        >
          <FormControl fullWidth margin="normal">
            <TextField
              id="seatNumber"
              label="Seat number"
              variant="outlined"
              name="seatNumber"
              value={formik.values.seatNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.seatNumber && Boolean(formik.errors.seatNumber)
              }
              helperText={formik.touched.seatNumber && formik.errors.seatNumber}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="seatType">Seat type</InputLabel>
            <Select
              id="seatType"
              name="seatType"
              label="Seat type"
              variant="outlined"
              value={formik.values.seatType}
              onChange={formik.handleChange}
              error={formik.touched.seatType && Boolean(formik.errors.seatType)}
            >
              <MenuItem value={0}>Seater</MenuItem>
              <MenuItem value={1}>Sleeper</MenuItem>
            </Select>
            <FormHelperText error>
              {formik.touched.seatType && formik.errors.seatType}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="seatType">Deck</InputLabel>
            <Select
              id="deck"
              name="deck"
              label="Deck"
              variant="outlined"
              value={formik.values.deck}
              onChange={formik.handleChange}
              error={formik.touched.deck && Boolean(formik.errors.deck)}
            >
              <MenuItem value={0}>Lower deck</MenuItem>
              <MenuItem value={1}>Upper deck</MenuItem>
            </Select>
            <FormHelperText error>
              {formik.touched.deck && formik.errors.deck}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              id="seatCost"
              name="seatCost"
              label="Seat cost"
              variant="outlined"
              value={formik.values.seatCost}
              onChange={formik.handleChange}
              error={formik.touched.seatCost && Boolean(formik.errors.seatCost)}
              helperText={formik.touched.seatCost && formik.errors.seatCost}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyRupeeIcon />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormHelperText>
            Once submitted you cannot edit the content.
          </FormHelperText>
          <strong sx={{color:"grey"}}>Submit carefully!!</strong>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Card>
    </div>
  );
}
