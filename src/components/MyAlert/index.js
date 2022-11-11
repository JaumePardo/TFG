import { useEffect, useState } from "react";
import { Alert, Collapse } from "@mui/material";

export default function MyAlert({ message, severity }) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(true);
  }, [message]);
  return (
    <div className="verificationEmailSended">
      <div>
        <Collapse in={open}>
          <Alert
            severity={severity}
            onClose={() => {
              setOpen(false);
            }}  
          >
            {message}
          </Alert>
        </Collapse>
      </div>
    </div>
  );
}
