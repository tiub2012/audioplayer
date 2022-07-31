import React, { FC, useEffect, useRef, useState } from 'react'

const AudioScale: FC = (): JSX.Element => {
	const [show, setShow] = useState(0)
	const [isPlay, setIsPlay] = useState(false)
	const [isMuted, setIsMuted] = useState(true)
	const [duration, setDuration] = useState(0)
	const [progress, setProgress] = useState(0)
	const [progressInfo, setProgressInfo] = useState<String>('')
	const [infoBlockView, setInfoBlockView] = useState('none')
	const [infoBlockLeft, setInfoBlockLeft] = useState(0)
	const [volumeValue, setVolumeValue] = useState(30)
	const audio = useRef<HTMLAudioElement>(null)
	const scaleBar = useRef<HTMLDivElement>(null)

	useEffect(() => {
		audio.current?.addEventListener('timeupdate', progressUpdata)
		audio.current?.addEventListener('loadedmetadata', init)
		audio.current?.addEventListener('end', end)
	}, [duration])

	const end = () => {
		if (audio.current) {
			audio.current.currentTime = 0
			setIsPlay(false)
			setProgress(0)
		}
	}
	const init = () => {
		if (audio.current?.duration) {
			setDuration(audio.current?.duration)
		}
	}
	const play = () => {
		audio.current?.play()
		setIsPlay(true)
	}
	const pause = () => {
		audio.current?.pause()
		setIsPlay(false)
	}
	const volume = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVolumeValue(parseInt(e.target.value))
		if (audio.current) {
			audio.current.volume = volumeValue / 100
		}
	}
	const progressUpdata = () => {
		const currentTime = audio.current?.currentTime
		if (currentTime) {
			setProgress((100 * currentTime) / duration)
		}
	}
	const setTime = (t: number, d: number): String => {
		const digit = (n: number): String => (n < 10 ? `0${n}` : `${n}`)
		const sec = digit(Math.floor(t % 60))
		const min = digit(Math.floor((t / 60) % 60))
		const hr = digit(Math.floor(t / 3600) % 60)

		if (d < 3600) {
			return min + ':' + sec
		} else {
			return hr + ':' + min + ':' + sec
		}
	}
	const mute = () => {
		setIsMuted(!isMuted)
		if (audio.current) {
			audio.current.muted = isMuted
		}
	}
	const rewind = (e: React.MouseEvent<HTMLDivElement>) => {
		if (scaleBar.current) {
			const width = scaleBar.current.offsetWidth
			const offsetX = e.nativeEvent.offsetX
			setProgress((100 * offsetX) / width)
			if (audio.current) {
				audio.current.pause()
				audio.current.currentTime = duration * (offsetX / width)
				if (isPlay) audio.current.play()
			}
		}
	}
	const onMouseover = () => {
		if(document.documentElement.clientWidth > 800){
			setInfoBlockView('block')
		}
	}
	const onMouseleave = () => {
		setInfoBlockView('none')
	}
	const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (scaleBar.current) {
			const width = scaleBar.current.offsetWidth
			const offsetX = e.nativeEvent.offsetX
			const percent = 100 * offsetX / width
			const progress = duration / 100 * percent
			setInfoBlockLeft(e.nativeEvent.offsetX - 19)
			setProgressInfo(setTime(progress, progress))
		}
	}

	return (
		<div className="center">
			<p className="header-text aeb">AudioScale</p>
			<hr />

			<div className="scale">
				<audio
					ref={audio}
					src="https://api.selcdn.ru/v1/SEL_53369/mng/player/tracks/Agata_Kristi_-_Skazochn.mp3"
				></audio>
				<div className="left-scale">
					<div className="inner-left-scale">
						{isPlay ? (
							<i className="fa fa-pause" onClick={() => pause()}></i>
						) : (
							<i className="fa fa-play" onClick={() => play()}></i>
						)}
					</div>
				</div>
				<div className="center-scale">
					<div className="inner-center-scale">
						<div className="top-inner-center-scale">
							<div
								className="scale-bar"
								ref={scaleBar}
								onClick={rewind}
								onMouseOver={onMouseover}
								onMouseLeave={onMouseleave}
								onMouseMove={onMouseMove}
							>
								<div
									className="fill-scale-bar"
									style={{ width: `${progress}%` }}
								>
									<div
										className="fill-scale-info-block"
										style={{ display: infoBlockView, left: `${infoBlockLeft}px` }}
									>
										<div className="scale-info-block">{progressInfo}</div>
										<div className="scale-info-triangle"></div>
									</div>
								</div>
							</div>
						</div>
						<div className="bottom-inner-center-scale">
							<div className="left-bottom-center-scale">
								<p className="timer">
									{setTime(audio.current?.currentTime || 0, duration)} /{' '}
									{setTime(duration, duration)}
								</p>
							</div>
							<div className="right-bottom-center-scale">
								<input
									type="range"
									min={0}
									max={100}
									value={volumeValue}
									onChange={(e) => volume(e)}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="right-scale">
					<div className="inner-right-scale">
						<div onClick={mute}>
							{isMuted || <div className="slash"></div>}
							<i className="fa-solid fa-volume-up"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AudioScale
