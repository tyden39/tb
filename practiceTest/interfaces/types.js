import PropTypes from 'prop-types'
// ===== ***** ===== ***** =====
//             ATOM
// ===== ===== ===== ===== =====
export const CUSTOM_BUTTON_TYPE = {
  className: PropTypes.string,
  appearance: PropTypes.oneOf([
    'default',
    'primary',
    'link',
    'subtle',
    'ghost',
  ]),
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  style: PropTypes.object,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
}

export const CUSTOM_HEADING_TYPE = {
  tag: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
}

export const CUSTOM_IMAGE_TYPE = {
  className: PropTypes.string,
  alt: PropTypes.string,
  fit: PropTypes.oneOf(['fill', 'contain', 'cover', 'none', 'scale-down']),
  position: PropTypes.oneOf(['top', 'center', 'bottom']),
  src: PropTypes.string.isRequired,
  yRate: PropTypes.number,
  onClick: PropTypes.func
}

export const CUSTOM_LINK_TYPE = {
  className: PropTypes.string,
  as: PropTypes.string,
  href: PropTypes.string,
  isPrevent: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
}

export const CUSTOM_TEXT_TYPE = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['span', 'p']),
  style: PropTypes.object,
  children: PropTypes.node.isRequired,
}

// ===== ***** ===== ***** =====
//           MOLECULE
// ===== ===== ===== ===== =====
export const AUDIO_PLAYER_TYPE = {
  className: PropTypes.string,
  isPlaying: PropTypes.bool,
  style: PropTypes.object,
}

export const CARD_GRADE_TYPE = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    description: PropTypes.string,
    isDisabled: PropTypes.bool,
    name: PropTypes.string,
    slug: PropTypes.string,
  }),
  openModal: PropTypes.func,
}

export const CARD_PART_TYPE = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    point: PropTypes.number,
  }),
  index: PropTypes.number.isRequired,
}

export const CARD_TEST_TYPE = {
  active: PropTypes.shape({
    state: PropTypes.number,
    setState: PropTypes.func,
  }),
  color: PropTypes.oneOf([0, 1, 2, 3]).isRequired,
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    url: PropTypes.string,
  }),
}

export const LOCKED_GRADE_NOTIFICATION_TYPE = {
  data: PropTypes.shape({
    name: PropTypes.string,
  }),
  status: PropTypes.shape({
    state: PropTypes.bool,
    setState: PropTypes.func,
  }),
}

export const TIMES_UP_WARNING_TYPE = {
  data: PropTypes.shape({
    name: PropTypes.string,
  }),
  status: PropTypes.shape({
    state: PropTypes.bool,
    setState: PropTypes.func,
  }),
}

// ===== ***** ===== ***** =====
//           ORGANISM
// ===== ===== ===== ===== =====
export const BLOCK_BOTTOM_GRADIENT_TYPE = {
  className: PropTypes.string,
  aos: PropTypes.object,
  style: PropTypes.object,
  children: PropTypes.node,
}

export const BLOCK_BOTTOM_GRADIENT_WITH_HEADER_TYPE = {
  className: PropTypes.string,
  style: PropTypes.object,
  customChildren: PropTypes.node,
  headerChildren: PropTypes.node,
  children: PropTypes.node,
}

export const BLOCK_CENTER_TYPE = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
}

export const BLOCK_CLOUD_TYPE = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
}

export const BLOCK_GAME_TYPE = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
}

export const BLOCK_PAPER_TYPE = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
}

export const BLOCK_WAVE_TYPE = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
}

export const GRADES_TYPE = {
  grades: PropTypes.array,
}

export const HEADER_TYPE = {
  page: PropTypes.shape({
    id: PropTypes.string,
    directionBtn: PropTypes.oneOf(['quit-app', 'back-home']),
    title: PropTypes.string,
  }),
}

export const HERO_TYPE = {
  data: PropTypes.shape({
    description: PropTypes.string,
    title: PropTypes.string,
  }),
}

export const PARTS_TYPE = {
  className: PropTypes.string,
  parts: PropTypes.array,
  style: PropTypes.object,
}

export const SPINNER_TYPE = {
  className: PropTypes.string,
}

export const TESTS_TYPE = {
  className: PropTypes.string,
  tests: PropTypes.array,
  style: PropTypes.object,
}
// ===== ***** ===== ***** =====
//           TEMPLATE
// ===== ===== ===== ===== =====
export const AUTH_WRAPPER_TYPE = {
  children: PropTypes.node,
}

export const TEST_WRAPPER_TYPE = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
}

export const WRAPPER_TYPE = {
  meta: PropTypes.object,
  isHavingHeader: PropTypes.bool,
  isLoading: PropTypes.bool,
  page: PropTypes.string,
  children: PropTypes.node,
}
