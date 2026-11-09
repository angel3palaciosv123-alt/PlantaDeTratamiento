/* ==========================================================
   MÓDULO TÉRMINOS DE REFERENCIA — rangos.js
   Único propietario de los criterios normativos, rangos y límites generales
   que alimentan los parámetros del proyecto. Los módulos de cálculo los
   consultan por TR.R.<nombre> (nunca definen los suyos).
   ========================================================== */
var TR={
  R:{
    R_RANGO:[0.7,0.9],        /* coeficiente de retorno R (RAS) */
    VF_RANGO:[0,0.15],        /* velocidad efectiva del flujo en la rejilla Vf (m/s) */
    PEND_ADU:[0.14,0.16],     /* pendiente de aducción S (m/m) */
    BL_ADU:[0.30,0.50],       /* borde libre de aducción BL (m) */
    VO_MIN:0.5                /* velocidad horizontal mínima Vo (m/s) */
  },
  rango:function(nombre){ return TR.R[nombre]; },

  /* Registro de tarjetas de parámetros. Cada tarjeta recoge los términos de referencia de una unidad. */
  tarjetas:[],
  registrarTarjeta:function(def){ TR.tarjetas.push(def); }
};
