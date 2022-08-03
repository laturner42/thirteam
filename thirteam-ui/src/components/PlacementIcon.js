import { Typography } from '@mui/material';

export default function PlacementIcon({ placement }) {
  return (
    <div>
      <div
        style={{
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'gold',
          width: 22,
          height: 22,
          margin: 5,
          borderRadius: 20,
          color: 'gold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography style={{ fontWeight: 'bold' }}>{placement}</Typography>
      </div>
    </div>
  )
}