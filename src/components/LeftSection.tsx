import icon from '../../public/icon.jpg'
import board from '../../public/board.jpg'
import { useState } from 'react'

export default function LeftSection() {

    const [username, setUsername] = useState<string>('')
    const [month, setMonth] = useState<string>('')
    const [year, setYear] = useState<string>('')
    const [matches, setMatches] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const fetchMatches = async () => {

        if (!username || !month || !year) {
            setError('Fill all fields')
            return
        }

        try {

            setLoading(true)
            setError('')

            const response = await fetch(
                `https://api.chess.com/pub/player/${username}/games/${year}/${month}`
            )

            if (!response.ok) {
                throw new Error('Failed to fetch matches')
            }

            const data = await response.json()
            console.log(data.games)
            setMatches(data.games || [])

        } catch (err) {
            setError('Could not fetch matches')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col items-center space-y-4 h-full w-full bg-primary-background py-5'>

            {/* Title + Icon */}
            <div className='flex space-x-1.5 px-6'>
                <img src={icon} className='rounded-md w-7 h-7' />
                <h2 className='text-xl text-white font-text-syne'>Chess reviewer</h2>
            </div>

            {/* Inputs */}
            <div className='flex flex-col space-y-3 px-3 w-full'>

                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className='border border-border-dark-background rounded-md bg-primary-background outline-0 px-2 py-2 text-white'
                />

                <div className='flex space-x-2'>

                    <input
                        type='text'
                        placeholder='Month (01-12)'
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className='border border-border-dark-background rounded-md bg-primary-background outline-0 px-2 py-2 text-white w-1/2'
                    />

                    <input
                        type='text'
                        placeholder='Year'
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className='border border-border-dark-background rounded-md bg-primary-background outline-0 px-2 py-2 text-white w-1/2'
                    />

                </div>

                <input
                    type='button'
                    value={loading ? 'Loading...' : 'Fetch'}
                    disabled={loading}
                    onClick={fetchMatches}
                    className='bg-secondary-backgruond text-black py-2 px-2 rounded-md hover:cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-all'
                />

            </div>

            {/* Divider */}
            <div className='w-full border-b border-secondary-backgruond' />

            {/* Error */}
            {
                error && (
                    <p className='text-red-400 text-sm'>
                        {error}
                    </p>
                )
            }

            {/* Matches */}
            <div className='flex flex-col w-full space-y-2 overflow-y-auto'>

                {
                    matches.map((match, index) => (
                        <div className='flex flex-row items-center hover:bg-primary-hoverd-background px-4 rounded-md'>
                            <img src={board} className='w-21 h-21 '/>
                            <div
                            key={index}
                            className='flex flex-col space-y-1 rounded-md p-2 text-white text-sm'
                            >
                                
                                <div className='flex space-x-1 items-center'>
                                    <div className='rounded-full bg-white w-4 h-4' />
                                    <h1>{match.white.username}</h1>
                                </div>

                                <div className='flex space-x-1 items-center'>
                                    <div className='rounded-full bg-black w-4 h-4' />
                                    <h1>{match.black.username}</h1>
                                </div>

                                <div className='flex items-center space-x-3'>
                                    <p>Winner: </p>{match.black.result && match.black.username === username ? (<p className='bg-green-500 rounded-md px-1 py-1'>WIN</p>) : <p className='bg-red-500 rounded-md  px-1 py-1'>LOST</p>}
                                </div>

                                <a
                                    href={match.url}
                                    target='_blank'
                                    className='text-blue-400 underline'
                                >
                                    Open Match
                                </a>
                            </div>
                        </div>
                    ))
                }

            </div>

        </div>
    )
}