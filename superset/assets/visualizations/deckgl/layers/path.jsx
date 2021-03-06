import { PathLayer } from 'deck.gl';

import * as common from './common';
import sandboxedEval from '../../../javascripts/modules/sandbox';

export default function getLayer(formData, payload, slice) {
  const fd = formData;
  const c = fd.color_picker;
  const fixedColor = [c.r, c.g, c.b, 255 * c.a];
  let data = payload.data.features.map(feature => ({
    ...feature,
    path: feature.path,
    width: fd.line_width,
    color: fixedColor,
  }));

  if (fd.js_datapoint_mutator) {
    const jsFnMutator = sandboxedEval(fd.js_datapoint_mutator);
    data = data.map(jsFnMutator);
  }

  return new PathLayer({
    id: `path-layer-${fd.slice_id}`,
    data,
    rounded: true,
    widthScale: 1,
    ...common.commonLayerProps(fd, slice),
  });
}
