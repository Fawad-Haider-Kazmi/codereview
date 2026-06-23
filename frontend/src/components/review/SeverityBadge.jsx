import Badge from '../ui/Badge'

export default function SeverityBadge({ critical = 0, warning = 0, info = 0 }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {critical > 0 && <Badge label={`${critical} Critical`} severity="critical" />}
      {warning  > 0 && <Badge label={`${warning} Warning`}  severity="warning"  />}
      {info     > 0 && <Badge label={`${info} Info`}        severity="info"     />}
      {critical === 0 && warning === 0 && info === 0 && <Badge label="No Issues" severity="success" />}
    </div>
  )
}