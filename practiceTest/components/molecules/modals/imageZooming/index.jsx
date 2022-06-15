import { useState } from 'react'

import { Modal, Slider } from 'rsuite'

import { CustomButton } from '../../../atoms/button'
import { CustomImage } from '../../../atoms/image'

export const ImageZooming = ({ data, status }) => {
  const { alt = '', src = '' } = data

  const { state, setState } = status

  const [zoomValue, setZoomValue] = useState(50)

  return (
    <Modal
      className="pt-m-image-zooming"
      backdropClassName="pt-m-image-zooming__backdrop"
      backdrop={true}
      dialogClassName="pt-m-image-zooming__dialog"
      open={state}
      size="xs"
      onClose={() => setState(false)}
    >
      <Modal.Body className="__body">
        <CustomButton className="__close" onClick={() => setState(false)}>
          <CustomImage
            className="__image"
            alt="close"
            src="/pt/images/icons/ic-close.svg"
            yRate={0}
          />
        </CustomButton>
        <img
          className="__main"
          src={src}
          alt={alt}
          style={{ transform: `scale(${0.5 + (zoomValue / 100) * 0.5})` }}
        />
        <div className="__bottom-control">
          <CustomButton
            className="__scale-down"
            onClick={() =>
              setZoomValue(zoomValue - 10 < 0 ? 0 : zoomValue - 10)
            }
          >
            <CustomImage
              className="__image"
              alt="Scale down"
              src="/pt/images/icons/ic-scale-down.svg"
              yRate={0}
            />
          </CustomButton>
          <Slider
            className="__slider"
            progress
            tooltip={false}
            value={zoomValue}
            onChange={(value) => setZoomValue(value)}
          />
          <CustomButton
            className="__scale-up"
            onClick={() =>
              setZoomValue(zoomValue + 10 > 100 ? 100 : zoomValue + 10)
            }
          >
            <CustomImage
              className="__image"
              alt="Scale up"
              src="/pt/images/icons/ic-scale-up.svg"
              yRate={0}
            />
          </CustomButton>
        </div>
      </Modal.Body>
    </Modal>
  )
}
