"use client"

/* eslint-disable  @typescript-eslint/no-explicit-any */


import styled from "styled-components";
import { useEffect, useState } from "react";
import { createClient } from '@sanity/client'
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";

const Loader = styled.div`
  z-index: 1100005;
  background: #0A302C;
  display: flex;
  align-items: center;
  justify-content: center;
  position:fixed;
  width: 100%;
  height: 100%;

  animation: fadeOut 1s ease-in-out forwards;
  animation-delay: 2.5s;

  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    99% {
      opacity: 0;
    }
    100%{
      display: none;
    }
  }

  svg {
  animation: spin 3s linear infinite;
  width: 60px;
  }

  @keyframes spin {
      from {
      transform: rotate(0deg);
    }
      to {
      transform: rotate(360deg);
    }
  }
`


const EventSlide = styled.div`
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
font-family: Ibarra Real Nova;
background: white;
color: white;
* {
  position: relative;
}


  button {
  background-color: rgba(0, 0, 0, .4);
  color: white;
  border: 2px #fff solid;
  padding: 8px;
  margin: 8px;
  cursor: pointer;

  @media(max-width: 480px) {
    padding: 6px;
  }
}


`

const Content = styled.div`
  position: fixed;
  top: 32px;
  left: 32px;
  right: 32px;
  bottom: 32px;
  border: 1px solid #FFE5BD;
  z-index: 3;

  h1 {
    margin-bottom: 0px;
    font-size: 6.5em;
    line-height: 1em;
    text-align: center;
  }

@media(max-width: 768px) {
    h1 {
    font-size: 3em;
  }

    p {
    display: none;
  }
}

  h4 {
  margin-top: 16px;
  margin-bottom: 32px;
}
`


const logo = <svg width="37" height="25" viewBox="0 0 37 25" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fillRule="evenodd" clipRule="evenodd" d="M0 19.3423C0 19.5994 0.112353 19.8437 0.307572 20.0111L5.47681 24.4418C5.63644 24.5787 5.83975 24.6539 6.05 24.6539L30.7885 24.6539C31.0163 24.6539 31.2353 24.5656 31.3994 24.4075L36.384 19.6075C36.5564 19.4415 36.6539 19.2125 36.6539 18.9731V12.3269H34.8923V17.6632L31.6692 16.3501V12.3269H29.9077V16.5775L28.3929 18.0923H8.60799L6.93077 16.5549V12.3269H5.16923V16.3802L1.76154 17.9623L1.76154 12.3269H0L0 19.3423ZM31.1004 22.25L34.1868 19.2779L30.9977 17.9786L29.8 19.1763L31.1004 22.25ZM8.82893 19.8539H28.174L29.4595 22.8923H7.42656L8.82893 19.8539ZM7.19622 19.1878L5.73856 22.3461L2.4935 19.5646L5.88797 17.9886L7.19622 19.1878ZM0 5.31155C0 5.05443 0.112353 4.81015 0.307572 4.64282L5.47681 0.212048C5.63644 0.0752182 5.83975 7.62939e-06 6.05 7.62939e-06L30.7885 7.62939e-06C31.0163 7.62939e-06 31.2353 0.0883007 31.3994 0.246342L36.384 5.04634C36.5564 5.21237 36.6539 5.44142 36.6539 5.68078V12.3269H34.8923V6.99067L31.6692 8.30378V12.3269H29.9077V8.07638L28.3929 6.56155H8.60799L6.93077 8.099V12.3269H5.16923V8.27369L1.76154 6.69155L1.76154 12.3269H0L0 5.31155ZM31.1004 2.40392L34.1868 5.37599L30.9977 6.67523L29.8 5.47753L31.1004 2.40392ZM8.82893 4.80001H28.174L29.4595 1.76155L7.42656 1.76155L8.82893 4.80001ZM7.19622 5.46603L5.73856 2.30777L2.4935 5.08925L5.88797 6.66525L7.19622 5.46603Z" fill="#FFE5BD" />
</svg>

const client = createClient({
  projectId: "qeirzen7",
  dataset: "production",
  apiVersion: "2022-07-06",
  useCdn: true,
});
console.log("client", client)

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export default function Home() {
  const [events, setEvents] = useState([]);
  const [chosenEvent, setChosenEvent] = useState(0);
  console.log("events", events)
  useEffect(() => {
    client
      .fetch(
        `* [_type == "event"]{
  title,
    videoTrailerUrl,
    videoPreviewUrl,
    private,
    rank,
    inviteUrl,
    eventDate
} `
      )
      .then((data) => {
        setEvents(data.toSorted((a: any, b: any) => a.rank < b.rank ? -1 : 1));
      });
  }, []);

  const ev = (events[chosenEvent % events.length] as any);

  useEffect(() => {
    let touchStartY: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY === null) return;

      const touchEndY = e.changedTouches[0].clientY;
      const swipeDistance = touchStartY - touchEndY;

      if (swipeDistance > 50) {
        setChosenEvent((prev) => prev + 1);
      } else if (swipeDistance < -50) {
        setChosenEvent((prev) => Math.max(prev - 1, 0));
      }

      touchStartY = null;
    };

    document.body.addEventListener("touchstart", handleTouchStart);
    document.body.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.body.removeEventListener("touchstart", handleTouchStart);
      document.body.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <>
      <Loader>
        <svg width="354" height="239" viewBox="0 0 354 239" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.0137 119.059L17.0137 173.484L49.9248 158.204V119.059H66.9375L66.9375 159.892L83.1357 174.74H274.216L288.847 160.109V119.059H305.859V157.914L336.987 170.596V119.059L354 119.059V183.246C354 185.558 353.06 187.771 351.395 189.374L303.254 235.731C301.669 237.258 299.554 238.111 297.354 238.111L58.4307 238.111C56.4002 238.111 54.4362 237.385 52.8945 236.063L2.9707 193.271L2.62695 192.959C0.954354 191.359 3.15289e-05 189.14 0 186.812L0 119.059H17.0137ZM0 51.2988C6.48894e-05 48.971 0.954383 46.7522 2.62695 45.1523L2.9707 44.8398L52.8945 2.04785C54.4362 0.72652 56.4002 4.88923e-05 58.4307 0L297.354 0C299.554 0.000167671 301.669 0.853698 303.254 2.37988L351.395 48.7373C353.06 50.3407 354 52.5536 354 54.8652V119.053L336.987 119.053V67.5156L305.859 80.1973V119.053H288.847V78.002L274.216 63.3711L83.1357 63.3711L66.9375 78.2197V119.053H49.9248V79.9072L17.0137 64.627L17.0137 119.053H0L0 51.2988ZM300.365 214.895L330.174 186.19L299.374 173.643L287.807 185.21L300.365 214.895ZM299.374 64.4688L330.174 51.9209L300.365 23.2168L287.807 52.9014L299.374 64.4688ZM284.517 221.098L272.103 191.753H85.2695L71.7256 221.098L284.517 221.098ZM85.2695 46.3584L272.103 46.3584L284.517 17.0137L71.7256 17.0137L85.2695 46.3584ZM55.4229 215.822L69.501 185.32L56.8652 173.739L24.083 188.96L55.4229 215.822ZM56.8652 64.3721L69.501 52.791L55.4229 22.2891L24.083 49.1514L56.8652 64.3721Z" fill="#FFE5BD" />
        </svg>
      </Loader>
      <EventSlide
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            setChosenEvent((prev) => (prev + 1) % events.length);
            e.preventDefault();
          }
        }}
        tabIndex={0}
      >
        <Content>
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              zIndex: 10,
            }}
          >
            <h1 >
              {events.length > 0 && ev?.title}
            </h1>
            <h4>
              {events.length > 0 &&
                new Date(ev?.eventDate).toLocaleString("default", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </h4>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Link href={ev?.videoTrailerUrl || ""} target="_blank">
                <button

                >
                  Watch Trailer
                </button>
              </Link>

              {events.length > 0 &&
                !ev.private
                && (ev.inviteUrl ?
                  <Link href={ev?.inviteUrl || ""}><button >RSVP</button></Link> : <button style={{ opacity: .5 }}>Invite Coming</button>)}


            </div>
            <p
              style={{
                position: "absolute",
                bottom: "16px",
                left: "0",
                right: "0",
                textAlign: "center",
              }}
            >
              {events.length > 0 && ev?.private && <>Due to food constraints, this event is smaller and invite-only. The invite list is cycled with time.</>}
            </p>

          </div>
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              display: "inline-block",
              backgroundColor: "rgba(255, 229, 189, 0.5)",
              border: "1px solid #FFE5BD",
              padding: "8px",
            }}
          >
            {logo}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "rgba(255, 229, 189, 0.5)",
              border: "1px solid #FFD700",
              padding: "8px",
              zIndex: 100
            }}
          >
            {events.map((event, index) => (
              <div
                key={index}
                onClick={() => setChosenEvent(index)}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: chosenEvent % events.length === index ? "#FFD700" : "#fff",
                  marginBottom: "4px",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

        </Content>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        />
        <video
          src={events.length > 0 && ev?.videoPreviewUrl}
          autoPlay
          muted
          loop
          webkit-playsinline playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </EventSlide></>
  );
}




