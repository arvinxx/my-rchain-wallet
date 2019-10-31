import React from 'react';
import styles from './style.less';

interface IPhraseBoxProps {
  phrase: string[];
  classname?: any;
  wordClassname?: any;
}

export default function({ phrase, classname, wordClassname }: IPhraseBoxProps) {
  return (
    <div className={styles.phrase + ' ' + classname}>
      {phrase.map((item: string) => (
        <span key={item} className={styles.word + ' ' + wordClassname}>
          {item}
        </span>
      ))}
    </div>
  );
}
