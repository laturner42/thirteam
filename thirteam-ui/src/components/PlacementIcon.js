import { Typography } from '@mui/material';

export default function PlacementIcon({ placement, size = 22 }) {
  return (
    <div>
      <div
        style={{
          borderWidth: size / 10,
          borderStyle: 'solid',
          borderColor: 'gold',
          width: size,
          height: size,
          margin: 5,
          borderRadius: size,
          color: 'gold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography style={{ fontWeight: 'bold', fontSize: size * 0.9 }}>{placement}</Typography>
      </div>
    </div>
  )
}