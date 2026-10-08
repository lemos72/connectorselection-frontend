// Standard square-root derating approximation, the same relationship most
// manufacturer connector derating curves are built on:
//
//   I_derated = I_rated * sqrt( (T_max - T_ambient) / (T_max - T_ref) )
//
// I_rated: current rating at the reference ambient the datasheet was tested at
// T_ref: that reference ambient temperature (°C)
// T_max: the connector's max rated temperature (°C)
// T_ambient: the actual operating ambient temperature (°C)

export function calculateDerating(iRated, tRef, tMax, tAmbient) {
  if (tMax <= tRef) {
    return {
      error: 'Max rated temperature must be higher than the reference ambient temperature.',
    };
  }
  if (tAmbient >= tMax) {
    return {
      error:
        'Operating ambient is at or above the connector’s max rated temperature — no current rating is safe at this ambient.',
    };
  }

  const ratio = (tMax - tAmbient) / (tMax - tRef);
  const deratedCurrent = iRated * Math.sqrt(Math.max(ratio, 0));

  return {
    deratedCurrent,
    ratioPct: ratio * 100,
  };
}

export function interpretDerating(ratioPct) {
  if (ratioPct >= 90) {
    return 'Your operating ambient is close to the reference condition — minimal derating required.';
  }
  if (ratioPct >= 60) {
    return 'Meaningful thermal headroom has been used up — confirm this derated rating still covers your application before finalizing.';
  }
  return 'Most of the connector’s thermal headroom is gone at this ambient — consider a higher-rated connector or reducing ambient temperature.';
}
